import {
  render as originalRender,
  renderHook as originalRenderHook,
} from "@testing-library/react-native";
import type React from "react";
import { type Middleware, SWRConfig } from "../swr";
import { TestProvider } from "./TestProvider";

export * from "@testing-library/react-native";

export const renderHook = <Result, Props>(
  renderCallback: (props: Props) => Result,
  middlewares?: Middleware[],
) => {
  return originalRenderHook(renderCallback, {
    wrapper: ({ children }) => (
      <TestProvider>
        <SWRConfig value={{ use: middlewares }}>{children}</SWRConfig>
      </TestProvider>
    ),
  });
};

/** TestProvider で wrap した独自の render */
export const render = (component: React.ReactElement) => {
  return originalRender(<TestProvider>{component}</TestProvider>);
};
