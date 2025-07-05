import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Checkbox } from "./index";

const meta = {
  component: Checkbox,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: "unchecked",
    onPress: () => console.log("Checkbox pressed"),
  },
};

export const Checked: Story = {
  args: {
    status: "checked",
    onPress: () => console.log("Checkbox pressed"),
  },
};

export const Indeterminate: Story = {
  args: {
    status: "indeterminate",
    onPress: () => console.log("Checkbox pressed"),
  },
};

export const Disabled: Story = {
  args: {
    status: "unchecked",
    disabled: true,
    onPress: () => console.log("Checkbox pressed"),
  },
};

export const DisabledChecked: Story = {
  args: {
    status: "checked",
    disabled: true,
    onPress: () => console.log("Checkbox pressed"),
  },
};
