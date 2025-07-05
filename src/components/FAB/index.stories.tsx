import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { FAB } from "./index";

const meta = {
  component: FAB,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof FAB>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: "add",
    onPress: () => console.log("FAB pressed"),
  },
};

export const Small: Story = {
  args: {
    icon: "add",
    size: "small",
    onPress: () => console.log("FAB pressed"),
  },
};

export const Large: Story = {
  args: {
    icon: "add",
    size: "large",
    onPress: () => console.log("FAB pressed"),
  },
};

export const Secondary: Story = {
  args: {
    icon: "heart",
    variant: "secondary",
    onPress: () => console.log("FAB pressed"),
  },
};

export const Surface: Story = {
  args: {
    icon: "create",
    variant: "surface",
    onPress: () => console.log("FAB pressed"),
  },
};

export const WithLabel: Story = {
  args: {
    icon: "add",
    label: "Add Item",
    onPress: () => console.log("FAB pressed"),
  },
};

export const Disabled: Story = {
  args: {
    icon: "add",
    disabled: true,
    onPress: () => console.log("FAB pressed"),
  },
};
