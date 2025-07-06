import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Articles } from ".";
import { handlers } from "./index.mocks";

const meta = {
  component: Articles,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Articles>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  parameters: {
    msw: {
      handlers: handlers.Success,
    },
  },
};
