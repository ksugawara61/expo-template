import * as SecureStore from "expo-secure-store";

interface TokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, value: string) => Promise<void>;
}

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

export const tokenCache = createTokenCache();
