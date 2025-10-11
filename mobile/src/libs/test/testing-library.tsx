import {
  render as originalRender,
  renderHook as originalRenderHook,
} from "@testing-library/react-native";
import type React from "react";
import { TestProvider } from "./TestProvider";

export * from "@testing-library/react-native";

export const renderHook = <Result, Props>(
  renderCallback: (props: Props) => Result,
) => {
  return originalRenderHook(renderCallback, {
    wrapper: ({ children }) => <TestProvider>{children}</TestProvider>,
  });
};

/** TestProvider で wrap した独自の render */
export const render = (component: React.ReactElement) => {
  const result = originalRender(<TestProvider>{component}</TestProvider>);
  return result;
};
