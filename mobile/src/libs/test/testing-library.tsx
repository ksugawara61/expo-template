import {
  render as originalRender,
  renderHook as originalRenderHook,
} from "@testing-library/react-native";
import type React from "react";
import { act } from "react";
import { type Middleware, SWRConfig } from "../swr";
import { TestProvider } from "./TestProvider";

export * from "@testing-library/react-native";

export const renderHook = async <Result, Props>(
  renderCallback: (props: Props) => Result,
  middlewares?: Middleware[],
) => {
  const result = await act(async () =>
    originalRenderHook(renderCallback, {
      wrapper: ({ children }) => (
        <TestProvider>
          <SWRConfig value={{ use: middlewares }}>{children}</SWRConfig>
        </TestProvider>
      ),
    }),
  );
  return result;
};

/** TestProvider で wrap した独自の render */
export const render = async (component: React.ReactElement) => {
  await act(async () =>
    originalRender(<TestProvider>{component}</TestProvider>),
  );
};
