import type { StorybookConfig } from "@storybook/react-native-web-vite";
import path from "path";
import { mergeConfig } from "vite";

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
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@clerk/clerk-expo": path.resolve(__dirname, "./mocks/clerk-expo.js"),
        },
      },
      optimizeDeps: {
        include: ["@clerk/clerk-expo"],
      },
    });
  },
};

export default config;
