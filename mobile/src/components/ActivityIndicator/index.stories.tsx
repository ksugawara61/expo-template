import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { ActivityIndicator } from "./index";

const meta = {
  component: ActivityIndicator,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof ActivityIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: "large",
  },
};

export const CustomColor: Story = {
  args: {
    color: "#f59e0b",
  },
};

export const NotAnimating: Story = {
  args: {
    animating: false,
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "bg-slate-100 p-4 rounded-lg",
  },
};
