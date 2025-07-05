import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  stories: [
    {
      directory: "../src/components",
      titlePrefix: "Components",
      files: "**/*.stories.?(ts|tsx|js|jsx)",
    },
    {
      directory: "../src/features",
      titlePrefix: "Features",
      files: "**/*.stories.?(ts|tsx|js|jsx)",
    },
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "storycap"],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      pluginReactOptions: {
        jsxRuntime: "automatic",
        jsxImportSource: "nativewind",
        babel: {
          plugins: ["react-native-reanimated/plugin"],
        },
      },
    },
  },
};

export default config;
