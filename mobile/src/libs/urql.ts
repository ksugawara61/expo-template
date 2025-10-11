/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: for urql wrapper */
import { useMemo } from "react";
import * as Urql from "urql";

export * from "urql";

export const urqlClient = new Urql.Client({
  url: "http://127.0.0.1:3000/graphql",
  exchanges: [Urql.cacheExchange, Urql.fetchExchange],
  suspense: true,
});

export const useSuspenseQuery = <
  Data = any,
  Variables extends Urql.AnyVariables = Urql.AnyVariables,
>(
  args: Urql.UseQueryArgs<Variables, Data>,
) => {
  const { context: argsContext } = args;
  const context = useMemo(
    () => ({ ...argsContext, suspense: true }),
    [argsContext],
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
  const { context: argsContext } = args;
  const context = useMemo(
    // suspense モードを無効化して実行
    () => ({ ...argsContext, suspense: false }),
    [argsContext],
  );
  return Urql.useQuery({ ...args, context });
};
