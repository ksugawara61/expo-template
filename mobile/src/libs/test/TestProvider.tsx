import { ClerkProvider } from "@clerk/clerk-expo";
import { type FC, type PropsWithChildren, Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Client,
  cacheExchange,
  fetchExchange,
  Provider,
} from "../graphql/urql";

// Mock tokenCache for tests
const mockTokenCache = {
  getToken: jest.fn(),
  saveToken: jest.fn(),
  clearToken: jest.fn(),
};

/**
 * テスト間でキャッシュを共有しないようにするため createUrqlClientを使用
 */
const createUrqlClient = () =>
  new Client({
    url: "http://127.0.0.1:3000/graphql",
    exchanges: [cacheExchange, fetchExchange],
    requestPolicy: "network-only", // テストでは常に最新のデータを取得するため
    suspense: true, // Suspenseモードを有効化
    fetchOptions: {
      headers: {
        "X-Test-User-Id": "test-user",
        "X-Test-Key": process.env.TEST_AUTH_KEY || "test-key",
      },
    },
  });

/** テストでSafeAreaViewが消えてしまうことを防ぐために設定 */
const testInitialMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const suspenseLoadingTestId = "suspenseLoading";

export const TestProvider: FC<PropsWithChildren> = ({ children }) => {
  // Use a valid Clerk test key format
  const testClerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

  return (
    <ClerkProvider publishableKey={testClerkKey} tokenCache={mockTokenCache}>
      <Provider value={createUrqlClient()}>
        <SafeAreaProvider initialMetrics={testInitialMetrics}>
          <Suspense
            fallback={
              <View testID={suspenseLoadingTestId}>
                <ActivityIndicator />
              </View>
            }
          >
            {children}
          </Suspense>
        </SafeAreaProvider>
      </Provider>
    </ClerkProvider>
  );
};
