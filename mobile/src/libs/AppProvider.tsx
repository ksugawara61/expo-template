import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import type { ErrorInfo, FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-boundary/ErrorFallback";
import { AuthProvider } from "./auth/AuthContext";
import { Provider, urqlClient } from "./graphql/urql";
import { PaperProvider } from "./react-native-paper/PaperProvider";

const handleError = (error: Error, errorInfo: ErrorInfo) => {
  console.error("Error caught by ErrorBoundary:", error, errorInfo);
};

const tokenCache = {
  getToken: async (key: string) => {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  saveToken: async (key: string, value: string) => {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

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
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <AuthProvider>
            <Provider value={urqlClient}>
              <PaperProvider>{children}</PaperProvider>
            </Provider>
          </AuthProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </ErrorBoundary>
  );
};
