import { Provider } from "jotai";
import type { FC, PropsWithChildren } from "react";

export const JotaiProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Provider>{children}</Provider>;
};
