import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Bookmarks } from ".";

const meta = {
  component: Bookmarks,
} satisfies Meta<typeof Bookmarks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Empty: Story = {};
