import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Input } from "./Input";

const meta = {
  component: Input,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
