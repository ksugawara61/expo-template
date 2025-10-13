import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Project, type SourceFile } from "ts-morph";

/**
 * 設定
 */
const GRAPHQL_TYPES_FILE = resolve(
  __dirname,
  "../src/libs/graphql/generated/graphql.ts", // 実際の生成ファイルパスに合わせて調整
);
const OUT_DIR = resolve(__dirname, "../src/libs/graphql");

/**
 * __typename の文字列リテラルを抽出する（正規表現版）
 */
const extractTypenamesFromText = (typeText: string): string[] => {
  const reg = /__typename\??:\s*['"`]([A-Za-z0-9_]+)['"`]/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: TODO: 別の方法を考える
  while ((m = reg.exec(typeText))) {
    set.add(m[1]);
  }
  return [...set];
};

/**
 * Fragment内の__typenameも含めて抽出する
 */
const extractTypenamesWithFragments = (
  source: SourceFile,
  typeName: string,
): string[] => {
  const typeNode = source.getTypeAliasOrThrow(typeName);
  const typeText = typeNode.getText();

  // 直接的な__typenameを抽出
  const directTypenames = extractTypenamesFromText(typeText);

  // Fragment参照を探す
  const fragmentRefRegex =
    /\{\s*'\s*\$fragmentRefs'\?:\s*\{\s*'([^']+)':\s*([A-Za-z0-9_]+)\s*\}\s*\}/g;
  const fragmentTypenames = new Set<string>();
  let match: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: Fragment参照を抽出するため必要
  while ((match = fragmentRefRegex.exec(typeText))) {
    const fragmentName = match[1];
    const fragmentTypeName = match[2].trim();

    // Fragment型定義を取得
    try {
      const fragmentTypeNode = source.getTypeAlias(fragmentTypeName);
      if (fragmentTypeNode) {
        const fragmentText = fragmentTypeNode.getText();
        const fragmentTypenamesArray = extractTypenamesFromText(fragmentText);
        for (const typename of fragmentTypenamesArray) {
          fragmentTypenames.add(typename);
        }
      }
    } catch {
      console.warn(
        `[WARN] Fragment type ${fragmentTypeName} not found for ${fragmentName}`,
      );
    }
  }

  // 直接的なtypenameとFragment内のtypenameを結合
  const allTypenames = [...new Set([...directTypenames, ...fragmentTypenames])];

  return (
    allTypenames
      .sort()
      // Query, Mutation 自体はすべてのQuery / Mutation に含まれるため除外する
      .filter((v) => v !== "Query" && v !== "Mutation")
      // 念のため重複排除（二重安全）
      .filter((v, i, arr) => arr.indexOf(v) === i)
  );
};

/**
 * AST を使って（必要なら厳密に）ネストを辿る拡張余地があるが、
 * まずは型全体テキストを解析
 */
// 以前: 個別 TypeAlias ごとにファイル生成する generateForTypeAlias() が存在したが
// 集約ファイル生成方式へ変更したため削除。

const main = () => {
  const project = new Project({
    tsConfigFilePath: resolve(__dirname, "../tsconfig.json"),
    skipAddingFilesFromTsConfig: false,
  });

  // 対象ファイルを明示的に追加（tsconfig に含まれるなら不要）
  const source = project.getSourceFileOrThrow(GRAPHQL_TYPES_FILE);
  const targetTypes = source
    .getTypeAliases()
    .map((t) => t.getName())
    .filter((name) => name.endsWith("Query") || name.endsWith("Mutation"))
    .filter((name) => name !== "Mutation" && name !== "Query");

  const operationTypenameMap = targetTypes.reduce<Record<string, string[]>>(
    (acc, typeName) => {
      const typenames = extractTypenamesWithFragments(source, typeName);
      if (typenames.length === 0) {
        console.warn(`[WARN] ${typeName}: __typename が見つかりませんでした`);
      }
      acc[typeName] = typenames;
      return acc;
    },
    {},
  );

  // 出力先確保
  mkdirSync(OUT_DIR, { recursive: true });
  const mapOutFile = resolve(OUT_DIR, "operationTypenames.generated.ts");
  const mapFileContent = `/*
 * AUTO-GENERATED FILE
 * Aggregated operation -> __typename[] map
 */

export const OPERATION_TYPENAMES = ${JSON.stringify(operationTypenameMap, null, 2)} as const;
export type OperationTypenameMap = typeof OPERATION_TYPENAMES;
export type OperationName = keyof OperationTypenameMap;
`;
  writeFileSync(mapOutFile, mapFileContent, "utf8");
  console.log(`[OK] Generated aggregated map: ${mapOutFile}`);
};

main();
