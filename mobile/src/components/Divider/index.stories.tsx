import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { Divider } from "./index";

const meta = {
  component: Divider,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, width: 300 }}>
        <Story />
      </View>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, height: 100, flexDirection: "row" }}>
        <Story />
      </View>
    ),
  ],
};

export const CustomStyle: Story = {
  args: {
    orientation: "horizontal",
    className: "bg-red-500 h-1",
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, width: 300 }}>
        <Story />
      </View>
    ),
  ],
};
