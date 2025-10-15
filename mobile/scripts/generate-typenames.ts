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
 * 単一の操作を処理して型名を抽出する
 */
const processOperation = (
  operationString: string,
  operationTypenameMap: Record<string, string[]>,
  setupCacheContent: string,
) => {
  // 操作名を抽出（query/mutation/fragment の次にある名前）
  const operationMatch = operationString.match(
    /(?:query|mutation|fragment)\s+(\w+)/,
  );
  if (!operationMatch) {
    return;
  }

  const operationName = operationMatch[1];

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

  // 操作文字列をエスケープしてTadaDocumentNode定義を探す
  const escapedOperationString = operationString.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  const operationDefRegex = new RegExp(
    `"${escapedOperationString}":\\s*TadaDocumentNode<([^>]+(?:>[^>]*)*)>`,
  );
  const defMatch = setupCacheContent.match(operationDefRegex);

  if (!defMatch) {
    return;
  }

  const documentType = defMatch[1];

  // documentType から __typename を抽出
  const typenameRegex = /__typename:\s*"([^"]+)"/g;
  const typenames = new Set<string>();
  let typenameMatch: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: __typename の値を順次抽出するため必要
  while ((typenameMatch = typenameRegex.exec(documentType))) {
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
  while ((fragmentMatch = fragmentRefRegex.exec(documentType))) {
    // Fragment参照がある場合、Fragment定義から __typename を探す
    const fragmentRefs = fragmentMatch[1];
    const fragmentNameMatch = fragmentRefs.match(/(\w+):\s*"(\w+)"/);
    if (fragmentNameMatch) {
      const fragmentName = fragmentNameMatch[2];

      // Fragment定義を検索
      const fragmentDefRegex = new RegExp(
        `"[^"]*fragment\\s+${fragmentName}[^"]*":\\s*TadaDocumentNode<([^>]*(?:>[^>]*)*?)>`,
      );
      const fragmentDefMatch = setupCacheContent.match(fragmentDefRegex);

      if (fragmentDefMatch) {
        const fragmentDocumentType = fragmentDefMatch[1];
        let fragmentTypenameMatch: RegExpExecArray | null;

        // Fragment内の __typename を抽出
        fragmentTypenameMatch = typenameRegex.exec(fragmentDocumentType);
        while (fragmentTypenameMatch) {
          const typename = fragmentTypenameMatch[1];
          if (typename !== "Query" && typename !== "Mutation") {
            typenames.add(typename);
          }
          fragmentTypenameMatch = typenameRegex.exec(fragmentDocumentType);
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
  // TadaDocumentNode で分割して各操作を抽出
  const parts = setupCacheContent.split("TadaDocumentNode");

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    // 最後の引用符までを取得
    const quoteMatch = part.match(/"([^"]*)":\s*$/);
    if (quoteMatch) {
      const operationString = quoteMatch[1];
      processOperation(
        operationString,
        operationTypenameMap,
        setupCacheContent,
      );
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
