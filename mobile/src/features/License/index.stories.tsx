import type { Meta, StoryObj } from "@storybook/react";
import { License } from "./index";

const meta: Meta<typeof License> = {
  component: License,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
