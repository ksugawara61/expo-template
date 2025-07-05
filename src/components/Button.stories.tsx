import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { Button } from "./Button";

const meta = {
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: "flex-start", padding: 20 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Button",
  },
};

export const Destructive: Story = {
  args: {
    title: "Delete",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    title: "Outline",
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    title: "Secondary",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    title: "Ghost",
    variant: "ghost",
  },
};

export const Large: Story = {
  args: {
    title: "Large Button",
    size: "lg",
  },
};

export const Small: Story = {
  args: {
    title: "Small",
    size: "sm",
  },
};

export const Loading: Story = {
  args: {
    title: "Loading",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    title: "Disabled",
    disabled: true,
  },
};
