import { ClerkProvider } from "@clerk/clerk-expo";
import type { ErrorInfo, FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-boundary/ErrorFallback";
import { tokenCache } from "./auth/tokenCache";
import { UrqlProvider } from "./graphql/urql";
import { PaperProvider } from "./react-native-paper/PaperProvider";
import { JotaiProvider } from "./store/JotaiProvider";

const handleError = (error: Error, errorInfo: ErrorInfo) => {
  console.error("Error caught by ErrorBoundary:", error, errorInfo);
};

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env.local",
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // アプリの状態をリセットする場合はここに実装
        console.log("ErrorBoundary reset");
      }}
    >
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <JotaiProvider>
          <UrqlProvider>
            <PaperProvider>{children}</PaperProvider>
          </UrqlProvider>
        </JotaiProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
};
