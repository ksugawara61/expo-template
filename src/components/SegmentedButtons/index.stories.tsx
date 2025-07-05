import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { SegmentedButtons } from "./index";

const meta = {
  component: SegmentedButtons,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof SegmentedButtons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "option1",
    onValueChange: (value) => console.log("Selected:", value),
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    value: "list",
    onValueChange: (value) => console.log("Selected:", value),
    options: [
      { value: "list", label: "List", icon: "list" },
      { value: "grid", label: "Grid", icon: "grid" },
      { value: "card", label: "Card", icon: "card" },
    ],
  },
};

export const IconOnly: Story = {
  args: {
    value: "heart",
    onValueChange: (value) => console.log("Selected:", value),
    options: [
      { value: "heart", label: "", icon: "heart" },
      { value: "star", label: "", icon: "star" },
      { value: "bookmark", label: "", icon: "bookmark" },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    value: "option1",
    onValueChange: (value) => console.log("Selected:", value),
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2", disabled: true },
      { value: "option3", label: "Option 3" },
    ],
  },
};

export const MultiSelect: Story = {
  args: {
    value: "option1,option3",
    onValueChange: (value) => console.log("Selected:", value),
    multiSelect: true,
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
  },
};
