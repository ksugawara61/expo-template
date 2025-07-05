import "../global.css";

import type { Preview } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { withScreenshot } from "storycap";

export const decorators = [
  (Story) => (
    <View
      style={{
        width: 414,
        height: 896,
        alignItems: "center",
        justifyContent: "center",
      }}
      testID="storybook-snapshot"
    >
      <Story />
    </View>
  ),
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
      fullPage: false,
      delay: 0,
      omitBackground: true,
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
};

export default preview;
