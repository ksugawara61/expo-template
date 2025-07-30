import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Articles } from ".";
import { handlers } from "./useContainer.mocks";

const meta = {
  component: Articles,
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
