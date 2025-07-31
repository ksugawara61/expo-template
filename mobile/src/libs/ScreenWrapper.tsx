import type { FC, PropsWithChildren } from "react";
import { SafeAreaView } from "react-native";
import { useTheme } from "react-native-paper";

export const ScreenWrapper: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </SafeAreaView>
  );
};
