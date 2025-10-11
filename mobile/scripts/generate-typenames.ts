import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Project, type TypeAliasDeclaration } from "ts-morph";

/**
 * 設定
 */
const TARGET_TYPES = ["GetArticlesQuery", "GetBookmarksQuery"]; // 追加したい型名を列挙 or CLI 引数化
const GRAPHQL_TYPES_FILE = resolve(
  __dirname,
  "../src/libs/gql/graphql.ts", // 実際の生成ファイルパスに合わせて調整
);
const OUT_DIR = resolve(__dirname, "../src/features/Bookmarks");
const SUFFIX = "Typenames.generated.ts";

/**
 * __typename の文字列リテラルを抽出する（正規表現版）
 */
function extractTypenamesFromText(typeText: string): string[] {
  const reg = /__typename\??:\s*['"`]([A-Za-z0-9_]+)['"`]/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = reg.exec(typeText))) {
    set.add(m[1]);
  }
  return [...set];
}

/**
 * AST を使って（必要なら厳密に）ネストを辿る拡張余地があるが、
 * まずは型全体テキストを解析
 */
function generateForTypeAlias(node: TypeAliasDeclaration) {
  const name = node.getName();
  const text = node.getText(); // `export type GetArticlesQuery = { ... }`
  const typenames = extractTypenamesFromText(text).sort();

  if (typenames.length === 0) {
    console.warn(`[WARN] ${name}: __typename が見つかりませんでした`);
    return;
  }

  const constIdentifier =
    name
      .replace(/Query|Mutation|Subscription/, "")
      .replace(/([A-Z])/g, "_$1")
      .replace(/^_/, "")
      .toUpperCase() + "_TYPENAMES";

  const outFile = resolve(OUT_DIR, `${name}${SUFFIX}`);
  const content = `/* AUTO-GENERATED FILE - DO NOT EDIT
   * Source: ${GRAPHQL_TYPES_FILE}
   * Type: ${name}
   */

export const ${constIdentifier} = ${JSON.stringify(typenames)} as const;
export type ${name}Typename = typeof ${constIdentifier}[number];
`;

  writeFileSync(outFile, content, "utf8");
  console.log(`[OK] Generated ${outFile}`);
}

function main() {
  const project = new Project({
    tsConfigFilePath: resolve(__dirname, "../tsconfig.json"),
    skipAddingFilesFromTsConfig: false,
  });

  // 対象ファイルを明示的に追加（tsconfig に含まれるなら不要）
  project.addSourceFileAtPath(GRAPHQL_TYPES_FILE);

  const source = project.getSourceFileOrThrow(GRAPHQL_TYPES_FILE);

  TARGET_TYPES.forEach((typeName) => {
    const typeNode = source.getTypeAlias(typeName);
    if (!typeNode) {
      console.error(`[ERROR] Type alias ${typeName} が見つかりません`);
      return;
    }
    generateForTypeAlias(typeNode);
  });
}

main();
