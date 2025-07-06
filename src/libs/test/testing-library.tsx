import {
  render as originalRender,
  renderHook,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react-native";
import type React from "react";
import { act } from "react";
import { type Middleware, SWRConfig } from "../swr";
import { suspenseLoadingTestId, TestProvider } from "./TestProvider";

export * from "@testing-library/react-native";

/**
 * renderHook の Suspense 対応用 wrapper
 * @deprecated
 */
export const renderSuspenseHook = async <Result, Props>(
  renderCallback: (props: Props) => Result,
  middlewares?: Middleware[],
) => {
  const result = renderHook(renderCallback, {
    wrapper: ({ children }) => (
      <TestProvider>
        <SWRConfig value={{ use: middlewares }}>{children}</SWRConfig>
      </TestProvider>
    ),
  });
  const suspenseElement = screen.queryByTestId(suspenseLoadingTestId);
  if (suspenseElement) {
    await waitForElementToBeRemoved(() =>
      screen.getByTestId(suspenseLoadingTestId),
    );
  }
  return result;
};

/** TestProvider で wrap した独自の render */
export const render = async (component: React.ReactElement) => {
  await act(async () =>
    originalRender(<TestProvider>{component}</TestProvider>),
  );
};

/**
 * render の Suspense 対応用 wrapper
 * @deprecated
 */
export const renderSuspense = async (component: React.ReactElement) => {
  originalRender(<TestProvider>{component}</TestProvider>);
  const suspenseElement = screen.queryByTestId(suspenseLoadingTestId);
  if (suspenseElement) {
    await waitForElementToBeRemoved(
      () => screen.getByTestId(suspenseLoadingTestId),
      { timeout: 5000 },
    );
  }
};
