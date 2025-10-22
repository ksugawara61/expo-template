/** biome-ignore-all lint/suspicious/noExplicitAny: for urql wrapper */
import { useCallback, useMemo, useState } from "react";
import * as Urql from "urql";
import { OPERATION_TYPENAMES } from "@/libs/graphql/operationTypenames.generated";

export * from "urql";

export const urqlClient = new Urql.Client({
  url: "http://127.0.0.1:3000/graphql",
  exchanges: [Urql.cacheExchange, Urql.fetchExchange],
  suspense: true,
  fetchOptions: () => {
    // テスト環境または開発環境でテスト用ヘッダーを追加
    const isDevelopmentOrTest =
      __DEV__ || process.env.NODE_ENV === "test";

    if (isDevelopmentOrTest) {
      return {
        headers: {
          "X-Test-User-Id": "test-user",
          "X-Test-Key": process.env.TEST_AUTH_KEY || "test-key",
        },
      };
    }

    return {};
  },
});

/**
 * OperationDefinition の name から operation 名を抽出
 * graphql-codegen が生成する TypedDocumentNode は JSON 形式の AST を持つ
 * name が取得できない場合は自動追加をスキップ
 */
const createAutoAdditionalTypenames = (query: Urql.DocumentInput) => {
  const definitions: any[] | undefined = (query as any)?.definitions;
  const opDef = definitions?.find((d) => d.kind === "OperationDefinition");
  const opName = `${opDef?.name?.value}Query`;
  if (!(opName in OPERATION_TYPENAMES)) {
    return;
  }
  return [...OPERATION_TYPENAMES[opName as keyof typeof OPERATION_TYPENAMES]];
};

export const useSuspenseQuery = <
  Data = any,
  Variables extends Urql.AnyVariables = Urql.AnyVariables,
>(
  args: Urql.UseQueryArgs<Variables, Data>,
) => {
  const { query, context: argsContext } = args;
  const additionalTypenames = useMemo(
    () =>
      argsContext?.additionalTypenames ?? createAutoAdditionalTypenames(query),
    [query, argsContext?.additionalTypenames],
  );
  const context = useMemo(
    () => ({ ...argsContext, additionalTypenames, suspense: true }),
    [argsContext, additionalTypenames],
  );
  const [result, executeQuery] = Urql.useQuery({ ...args, context });

  // suspense モードが有効な場合、エラーまたはデータ未取得時にエラーをスロー
  if (result.error) {
    throw result.error;
  }

  if (typeof result.data === "undefined") {
    // suspense モードではここに来ることはない想定
    throw new Error("data is undefined");
  }

  return [{ ...result, data: result.data as Data }, executeQuery] as const;
};

type LazyQueryState<Data, Variables extends Urql.AnyVariables> = {
  fetching: boolean;
} & Partial<Urql.OperationResult<Data, Variables>>;

export const useQuery = <
  Data = any,
  Variables extends Urql.AnyVariables = Urql.AnyVariables,
>(
  args: Urql.UseQueryArgs<Variables, Data>,
) => {
  const { query, context: argsContext } = args;
  const additionalTypenames = useMemo(
    () =>
      argsContext?.additionalTypenames ?? createAutoAdditionalTypenames(query),
    [query, argsContext?.additionalTypenames],
  );
  const context = useMemo(
    // suspense モードを無効化して実行
    () => ({ ...argsContext, additionalTypenames, suspense: false }),
    [argsContext, additionalTypenames],
  );
  return Urql.useQuery({ ...args, context });
};

export const useLazyQuery = <
  Data = any,
  Variables extends Urql.AnyVariables = Urql.AnyVariables,
>(
  query: Urql.DocumentInput<Data, Variables>,
) => {
  const client = Urql.useClient();
  const [data, setData] = useState<LazyQueryState<Data, Variables>>({
    data: undefined,
    error: undefined,
    fetching: false,
  });

  const executeQuery = useCallback(
    async (
      variables: Variables,
    ): Promise<Urql.OperationResult<Data, Variables>> => {
      setData((prev) => ({ ...prev, fetching: true }));
      const response = await client.query(query, variables).toPromise();
      setData({ ...response, fetching: false });
      return response;
    },
    [client, query],
  );

  return [data, executeQuery] as const;
};
