import type { Meta, StoryObj } from "@storybook/react";
import { License } from "./index";

const meta: Meta<typeof License> = {
  title: "Features/License",
  component: License,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
