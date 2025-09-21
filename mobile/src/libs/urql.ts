import { type UseQueryArgs, useQuery as useUrqlQuery } from "urql";

export * from "urql";

/**
 * urql の suspense モードを使うためのカスタムフック
 * 公式の suspense モードでは data の型が undefined になってしまうが、
 * 想定していない挙動のため、型を保証するためにこのカスタムフックを作成
 */
export const useQuery = <T = unknown, V extends object = object>(
  args: UseQueryArgs<V>,
) => {
  const [result, executeQuery] = useUrqlQuery<T, V>(args);

  // suspense モードが有効な場合、エラーまたはデータ未取得時にエラーをスロー
  if (result.error) {
    throw result.error;
  }

  if (typeof result.data === "undefined") {
    // suspense モードではここに来ることはない想定
    throw new Error("data is undefined");
  }

  return [{ ...result, data: result.data }, executeQuery] as const;
};
