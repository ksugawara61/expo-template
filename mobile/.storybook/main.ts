import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  stories: [
    {
      directory: "../src/components",
      titlePrefix: "Components",
      files: "**/{*.stories,stories}.?(ts|tsx|js|jsx)",
    },
    {
      directory: "../src/features",
      titlePrefix: "Features",
      files: "**/{*.stories,stories}.?(ts|tsx|js|jsx)",
    },
  ],
  addons: ["@storybook/addon-a11y", "storycap"],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      pluginReactOptions: {
        jsxRuntime: "automatic",
        babel: {
          plugins: ["react-native-reanimated/plugin"],
        },
      },
    },
  },
};

export default config;
