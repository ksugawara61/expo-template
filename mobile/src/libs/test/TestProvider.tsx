import { type FC, type PropsWithChildren, Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "../react-query";

/** テストでSafeAreaViewが消えてしまうことを防ぐために設定 */
const testInitialMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // テスト間でキャッシュを利用しないようにするため設定
        refetchOnWindowFocus: false,
        retry: false,
        // テストでは即座に古いデータにする
        staleTime: 0,
        gcTime: 0, // cacheTime was renamed to gcTime in v5
      },
      mutations: {
        retry: false,
      },
    },
  });

export const suspenseLoadingTestId = "suspenseLoading";

export const TestProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
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
    </QueryClientProvider>
  );
};
