import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { FC, PropsWithChildren } from "react";

const client = new ApolloClient({
  uri: "http://127.0.0.1:3000/graphql",
  cache: new InMemoryCache(),
});

export const AppApolloProvider: FC<PropsWithChildren> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
