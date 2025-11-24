import type { ErrorInfo, FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-boundary/ErrorFallback";
import { UrqlProvider } from "./graphql/urql";
import { PaperProvider } from "./react-native-paper/PaperProvider";
import { StoreProvider } from "./store/StoreProvider";

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
      <StoreProvider>
        <UrqlProvider>
          <PaperProvider>{children}</PaperProvider>
        </UrqlProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
};
