import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { maskFragments } from "@/libs/graphql/gql-tada";
import { BOOKMARK } from "../Bookmarks";
import { BookmarkAddEdit } from ".";
import { handlers } from "./mocks";

const meta = {
  component: BookmarkAddEdit,
} satisfies Meta<typeof BookmarkAddEdit>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Create: Story = {
  parameters: {
    msw: {
      handlers: handlers.Success,
    },
  },
};

const bookmark = maskFragments([BOOKMARK], {
  __typename: "Bookmark",
  id: "1",
  title: "Example Bookmark",
  url: "https://example.com",
  description: "This is an example bookmark.",
  created_at: "2024-01-01T00:00:00+09:00",
  updated_at: "2024-01-01T00:00:00+09:00",
  tags: [],
});

export const Edit: Story = {
  parameters: {
    msw: {
      handlers: handlers.Success,
    },
  },
  args: {
    bookmark,
  },
};
