import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Articles } from ".";

const meta = {
  component: Articles,
} satisfies Meta<typeof Articles>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
