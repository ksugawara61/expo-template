import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { BookmarkListWrapper } from ".";
import { MocksBookmarks } from "./index.mocks";

const meta = {
  component: BookmarkListWrapper,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof BookmarkListWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [MocksBookmarks.success],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [MocksBookmarks.empty],
    },
  },
};
