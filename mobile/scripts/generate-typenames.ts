import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * 設定
 */
const GRAPHQL_CACHE_FILE = resolve(
  __dirname,
  "../src/libs/graphql/gql-tada/graphql-cache.d.ts", // gql.tada のキャッシュファイル
);
const OUT_DIR = resolve(__dirname, "../src/libs/graphql");

/**
 * GraphQL操作とその型定義のペアを処理する
 */
const processOperationPair = (
  operationLine: string,
  tadaDocumentLine: string,
  operationTypenameMap: Record<string, string[]>,
  setupCacheContent: string,
) => {
  // 操作文字列を抽出
  const operationMatch = operationLine.match(/^"([^"]*)":/);
  if (!operationMatch) {
    return;
  }

  const operationString = operationMatch[1];

  // 操作名を抽出（query/mutation/fragment の次にある名前）
  const operationNameMatch = operationString.match(
    /(?:query|mutation|fragment)\s+(\w+)/,
  );
  if (!operationNameMatch) {
    return;
  }

  const operationName = operationNameMatch[1];

  // Query/Mutation/Fragment の判定と名前の正規化
  let normalizedName: string;
  if (operationString.includes("query ")) {
    normalizedName = `${operationName}Query`;
  } else if (operationString.includes("mutation ")) {
    normalizedName = `${operationName}Mutation`;
  } else if (operationString.includes("fragment ")) {
    // Fragment は除外（操作として扱わない）
    return;
  } else {
    return;
  }

  // TadaDocumentNodeの最初の型パラメータを抽出（ネストした括弧に対応）
  const tadaStart = tadaDocumentLine.indexOf("TadaDocumentNode<");
  if (tadaStart === -1) {
    return;
  }

  let bracketCount = 0;
  const typeStart = tadaStart + "TadaDocumentNode<".length;
  let typeEnd = typeStart;
  let inString = false;
  let stringChar = "";

  for (let i = typeStart; i < tadaDocumentLine.length; i++) {
    const char = tadaDocumentLine[i];

    if (!inString) {
      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
      } else if (char === "{") {
        bracketCount++;
      } else if (char === "}") {
        bracketCount--;
      } else if (char === "," && bracketCount === 0) {
        // 最初のコンマで停止（最初の型パラメータのみを取得）
        typeEnd = i;
        break;
      }
    } else {
      if (
        char === stringChar &&
        (i === 0 || tadaDocumentLine[i - 1] !== "\\")
      ) {
        inString = false;
      }
    }

    // 型パラメータが最後まで続く場合は最後の位置を記録
    typeEnd = i + 1;
  }

  const firstTypeParam = tadaDocumentLine.substring(typeStart, typeEnd).trim();
  if (!firstTypeParam) {
    return;
  }

  // __typename を抽出
  const typenameRegex = /__typename:\s*"([^"]+)"/g;
  const typenames = new Set<string>();
  let typenameMatch: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: __typename の値を順次抽出するため必要
  while ((typenameMatch = typenameRegex.exec(firstTypeParam))) {
    const typename = typenameMatch[1];
    // Query, Mutation 自体は除外
    if (typename !== "Query" && typename !== "Mutation") {
      typenames.add(typename);
    }
  }

  // Fragment参照も確認
  const fragmentRefRegex = /\[\$tada\.fragmentRefs\]:\s*\{\s*([^}]+)\s*\}/g;
  let fragmentMatch: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: Fragment参照を順次処理するため必要
  while ((fragmentMatch = fragmentRefRegex.exec(firstTypeParam))) {
    // Fragment参照がある場合、Fragment定義から __typename を探す
    const fragmentRefs = fragmentMatch[1];
    const fragmentNameMatch = fragmentRefs.match(/(\w+):\s*"(\w+)"/);
    if (fragmentNameMatch) {
      const fragmentName = fragmentNameMatch[2];

      // setupCacheContent全体でFragment定義を検索（より正確な方法）
      const lines = setupCacheContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        const nextLine = lines[i + 1];

        // Fragment定義の行を探す
        if (
          line.startsWith('"') &&
          line.includes(`fragment ${fragmentName}`) &&
          line.endsWith(":")
        ) {
          if (nextLine.includes("TadaDocumentNode<")) {
            // Fragment のTadaDocumentNodeの最初の型パラメータを抽出
            const fragmentTadaMatch = nextLine.match(
              /TadaDocumentNode<([^,}]+(?:\{[^}]*\}[^,}]*)*)/,
            );
            if (fragmentTadaMatch) {
              const fragmentTypeParam = fragmentTadaMatch[1].trim();

              // Fragment内の __typename を抽出
              let fragmentTypenameMatch: RegExpExecArray | null;
              fragmentTypenameMatch = typenameRegex.exec(fragmentTypeParam);
              while (fragmentTypenameMatch) {
                const typename = fragmentTypenameMatch[1];
                if (typename !== "Query" && typename !== "Mutation") {
                  typenames.add(typename);
                }
                fragmentTypenameMatch = typenameRegex.exec(fragmentTypeParam);
              }
            }
            break;
          }
        }
      }
    }
  }

  operationTypenameMap[normalizedName] = [...typenames].sort();
};

/**
 * gql.tada のキャッシュファイルから __typename を抽出する
 */
const extractTypenamesFromGqlTadaCache = (
  cacheFileContent: string,
): Record<string, string[]> => {
  const operationTypenameMap: Record<string, string[]> = {};

  // setupCache interface の中身を抽出（ネストした括弧に対応）
  const setupCacheMatch = cacheFileContent.match(
    /interface setupCache \{([\s\S]*?)\n\s*\}/,
  );
  if (!setupCacheMatch) {
    throw new Error("setupCache interface not found in gql.tada cache file");
  }

  const setupCacheContent = setupCacheMatch[1];

  // 行ごとに処理して、GraphQL操作とその型定義をペアで見つける
  const lines = setupCacheContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    // GraphQL操作の行（"で始まり":"で終わる）
    if (line.startsWith('"') && line.endsWith(":")) {
      // 対応するTadaDocumentNode行
      if (nextLine.includes("TadaDocumentNode<")) {
        processOperationPair(
          line,
          nextLine,
          operationTypenameMap,
          setupCacheContent,
        );
      }
    }
  }

  return operationTypenameMap;
};

const main = () => {
  // gql.tada のキャッシュファイルを読み込み
  const cacheFileContent = readFileSync(GRAPHQL_CACHE_FILE, "utf8");

  // __typename を抽出
  const operationTypenameMap =
    extractTypenamesFromGqlTadaCache(cacheFileContent);

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
  console.log(
    `[INFO] Operations found: ${Object.keys(operationTypenameMap).join(", ")}`,
  );
};

main();
