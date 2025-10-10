import type { ErrorInfo, FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";
import { ErrorFallback } from "@/components/error-boundary/ErrorFallback";
import { PaperProvider } from "./react-native-paper/PaperProvider";

const handleError = (error: Error, errorInfo: ErrorInfo) => {
  console.error("Error caught by ErrorBoundary:", error, errorInfo);
};

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // アプリの状態をリセットする場合はここに実装
        console.log("ErrorBoundary reset");
      }}
    >
      <SWRConfig
        value={{
          suspense: true,
          revalidateOnFocus: false,
          shouldRetryOnError: true,
          errorRetryCount: 3,
          errorRetryInterval: 1000,
          onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // ネットワークエラーまたは5xxエラーの場合のみリトライ
            if (error?.status === 404) return;

            // 最大リトライ回数に達した場合は停止
            if (retryCount >= 3) return;

            // 指数バックオフでリトライ
            setTimeout(
              () => revalidate({ retryCount }),
              1000 * 2 ** retryCount,
            );
          },
        }}
      >
        <PaperProvider>{children}</PaperProvider>
      </SWRConfig>
    </ErrorBoundary>
  );
};
