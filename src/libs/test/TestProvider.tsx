import { type FC, type PropsWithChildren, Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SWRConfig } from "swr";

const testSwrConfig = {
  /** テスト間でキャッシュを利用しないようにするため設定 */
  provider: () => new Map(),
};

/** テストでSafeAreaViewが消えてしまうことを防ぐために設定 */
const testInitialMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const suspenseLoadingTestId = "suspenseLoading";

export const TestProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig value={testSwrConfig}>
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
    </SWRConfig>
  );
};
