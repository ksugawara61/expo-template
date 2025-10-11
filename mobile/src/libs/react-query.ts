import { QueryClient } from "@tanstack/react-query";

export * from "@tanstack/react-query";

/**
 * TanStack Query クライアントの設定
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // フォーカス時の再取得を無効化（SWRの設定と合わせる）
      refetchOnWindowFocus: false,
      // エラー時のリトライ設定（SWRの設定と合わせる）
      retry: 3,
      retryDelay: (attemptIndex) => 1000 * 2 ** attemptIndex,
    },
    mutations: {
      // ミューテーション失敗時のリトライはデフォルトで無効
      retry: false,
    },
  },
});

/**
 * エラーハンドリングの設定
 */
queryClient.setQueryDefaults(["query"], {
  retry: (failureCount, error) => {
    // 404エラーの場合はリトライしない（SWRの設定と合わせる）
    if ((error as { status?: number })?.status === 404) {
      return false;
    }
    // 最大3回まで
    return failureCount < 3;
  },
});
