import type { FC, PropsWithChildren } from "react";
import { AppApolloProvider } from "./graphql/AppApolloProvider";
import { PaperProvider } from "./react-native-paper/PaperProvider";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppApolloProvider>
      <PaperProvider>{children}</PaperProvider>
    </AppApolloProvider>
  );
};
