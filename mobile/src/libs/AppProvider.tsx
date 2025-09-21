import type { FC, PropsWithChildren } from "react";
import { AppUrqlProvider } from "./graphql/AppUrqlProvider";
import { PaperProvider } from "./react-native-paper/PaperProvider";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppUrqlProvider>
      <PaperProvider>{children}</PaperProvider>
    </AppUrqlProvider>
  );
};
