import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Badge } from "./index";

const meta = {
  component: Badge,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};
