import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { screen } from "@storybook/test";
import { Bookmarks } from ".";
import { MocksBookmarks } from "./mocks";

const meta = {
  component: Bookmarks,
} satisfies Meta<typeof Bookmarks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [MocksBookmarks.success],
    },
    screenshot: {
      waitFor: async () => {
        await screen.findByText(/React NativeとExpoで始める/);
      },
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [MocksBookmarks.empty],
    },
    screenshot: {
      waitFor: async () => {
        await screen.findByText(
          /右下のボタンから新しいブックマークを追加できます/,
        );
      },
    },
  },
};
