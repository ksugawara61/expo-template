import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { HelperText } from "./index";

const meta = {
  component: HelperText,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof HelperText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is a helper text message",
    type: "info",
    visible: true,
  },
};

export const ErrorType: Story = {
  args: {
    children: "This field is required",
    type: "error",
    visible: true,
  },
};

export const Hidden: Story = {
  args: {
    children: "This helper text is hidden",
    type: "info",
    visible: false,
  },
};

export const LongText: Story = {
  args: {
    children:
      "This is a longer helper text message that might wrap to multiple lines to provide more detailed information",
    type: "info",
    visible: true,
  },
};
