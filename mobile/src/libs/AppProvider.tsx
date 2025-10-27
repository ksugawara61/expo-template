import { Provider as JotaiProvider } from "jotai";
import type { ErrorInfo, FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-boundary/ErrorFallback";
import { AuthProvider } from "./auth/AuthContext";
import { ClerkProvider } from "./auth/ClerkProvider";
import { Provider, urqlClient } from "./graphql/urql";
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
      <JotaiProvider>
        <ClerkProvider>
          <AuthProvider>
            <Provider value={urqlClient}>
              <PaperProvider>{children}</PaperProvider>
            </Provider>
          </AuthProvider>
        </ClerkProvider>
      </JotaiProvider>
    </ErrorBoundary>
  );
};
