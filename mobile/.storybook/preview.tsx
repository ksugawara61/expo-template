import type { Preview } from "@storybook/react-native-web-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { useEffect } from "react";
import { View } from "react-native";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { withScreenshot } from "storycap";
import { AppProvider } from "../src/libs/AppProvider";
import { ScreenWrapper } from "../src/libs/ScreenWrapper";

initialize();

export const decorators = [
  (Story) => {
    useEffect(() => {
      // Story 切り替え後に msw のレスポンスを更新するためリロードする
      return () => window.location.reload();
    }, []);

    return (
      <AppProvider>
        <View
          style={{
            width: 414,
            height: 896,
            alignItems: "center",
            justifyContent: "center",
          }}
          testID="storybook-snapshot"
        >
          <ScreenWrapper>
            <Story />
          </ScreenWrapper>
        </View>
      </AppProvider>
    );
  },
  withScreenshot,
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    screenshot: {
      viewport: {
        width: 414,
        height: 896,
      },
    },
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  initialGlobals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  loaders: [mswLoader],
  tags: ["autodocs"],
};

export default preview;
