import type { Meta, StoryObj } from "@storybook/react";
import { Settings } from "./index";

const meta: Meta<typeof Settings> = {
  component: Settings,
  parameters: {
    clerk: {
      signOut: async () => {
        console.log("Mock sign out");
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
