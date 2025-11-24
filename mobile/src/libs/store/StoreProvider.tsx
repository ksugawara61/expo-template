import { ClerkProvider, type TokenCache } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import type { FC, PropsWithChildren } from "react";
import { JotaiProvider } from "./JotaiProvider";

const createTokenCache = (): TokenCache => {
  return {
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
};

const tokenCache = createTokenCache();

export const StoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env.local",
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <JotaiProvider>{children}</JotaiProvider>
    </ClerkProvider>
  );
};
