import type { FC, PropsWithChildren } from "react";
import { Client, cacheExchange, fetchExchange, Provider } from "urql";

const client = new Client({
  url: "http://127.0.0.1:3000/graphql",
  exchanges: [cacheExchange, fetchExchange],
  suspense: true,
});

export const AppUrqlProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Provider value={client}>{children}</Provider>;
};
