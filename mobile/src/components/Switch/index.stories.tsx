import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Switch } from "./index";

const meta = {
  component: Switch,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: false,
    onValueChange: (value) => console.log("Switch value:", value),
  },
};

export const Enabled: Story = {
  args: {
    value: true,
    onValueChange: (value) => console.log("Switch value:", value),
  },
};

export const Disabled: Story = {
  args: {
    value: false,
    disabled: true,
    onValueChange: (value) => console.log("Switch value:", value),
  },
};

export const DisabledEnabled: Story = {
  args: {
    value: true,
    disabled: true,
    onValueChange: (value) => console.log("Switch value:", value),
  },
};

export const CustomColor: Story = {
  args: {
    value: true,
    color: "#10b981",
    onValueChange: (value) => console.log("Switch value:", value),
  },
};
