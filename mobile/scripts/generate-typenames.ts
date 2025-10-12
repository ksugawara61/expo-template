import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Project } from "ts-morph";

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
function extractTypenamesFromText(typeText: string): string[] {
  const reg = /__typename\??:\s*['"`]([A-Za-z0-9_]+)['"`]/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: TODO: 別の方法を考える
  while ((m = reg.exec(typeText))) {
    set.add(m[1]);
  }
  return [...set];
}

/**
 * AST を使って（必要なら厳密に）ネストを辿る拡張余地があるが、
 * まずは型全体テキストを解析
 */
// 以前: 個別 TypeAlias ごとにファイル生成する generateForTypeAlias() が存在したが
// 集約ファイル生成方式へ変更したため削除。

function main() {
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
      const typeNode = source.getTypeAliasOrThrow(typeName);
      const typenames = extractTypenamesFromText(typeNode.getText())
        .sort()
        // Query, Mutation 自体はすべてのQuery / Mutation に含まれるため除外する
        .filter((v) => v !== "Query" && v !== "Mutation")
        // 念のため重複排除（二重安全）
        .filter((v, i, arr) => arr.indexOf(v) === i);
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
}

main();
