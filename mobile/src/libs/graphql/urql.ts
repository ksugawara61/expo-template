/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: for urql wrapper */
import { useMemo } from "react";
import * as Urql from "urql";
import { OPERATION_TYPENAMES } from "@/libs/graphql/operationTypenames.generated";

export * from "urql";

export const urqlClient = new Urql.Client({
  url: "http://127.0.0.1:3000/graphql",
  exchanges: [Urql.cacheExchange, Urql.fetchExchange],
  suspense: true,
});

/**
 * gql.tada のクエリから operation 名を抽出
 * gql.tada が生成するクエリオブジェクトのAST構造から operation 名を取得
 */
const createAutoAdditionalTypenames = (query: Urql.DocumentInput) => {
  const definitions: any[] | undefined = (query as any)?.definitions;
  const opDef = definitions?.find((d) => d.kind === "OperationDefinition");
  const opName = `${opDef?.name?.value}${opDef?.operation === "mutation" ? "Mutation" : "Query"}`;
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

export const useMutation = <
  Data = any,
  Variables extends Urql.AnyVariables = Urql.AnyVariables,
>(
  query: Urql.DocumentInput,
) => {
  const [result, executeMutation] = Urql.useMutation<Data, Variables>(query);

  const executeWithAutoTypenames = (
    variables?: Variables,
    context?: Partial<Urql.OperationContext>,
  ) => {
    const additionalTypenames =
      context?.additionalTypenames ?? createAutoAdditionalTypenames(query);
    return executeMutation(variables, { ...context, additionalTypenames });
  };

  return [result, executeWithAutoTypenames] as const;
};
