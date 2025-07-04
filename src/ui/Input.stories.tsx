import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

import { View } from "react-native";

import { Input } from "./Input";

const meta = {
  component: Input,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Story />
      </View>
    ),
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
