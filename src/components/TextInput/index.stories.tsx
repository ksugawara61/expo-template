import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { TextInput, TextInputIcon } from "./index";

const meta = {
  component: TextInput,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    onChangeText: (text) => console.log("Text changed:", text),
  },
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    onChangeText: (text) => console.log("Text changed:", text),
  },
};

export const Flat: Story = {
  args: {
    mode: "flat",
    label: "Name",
    placeholder: "Enter your name",
    onChangeText: (text) => console.log("Text changed:", text),
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    error: true,
    onChangeText: (text) => console.log("Text changed:", text),
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    placeholder: "This field is disabled",
    disabled: true,
    onChangeText: (text) => console.log("Text changed:", text),
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    left: <TextInputIcon icon="search" />,
    onChangeText: (text) => console.log("Text changed:", text),
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    secureTextEntry: true,
    right: (
      <TextInputIcon
        icon="eye"
        onPress={() => console.log("Toggle password visibility")}
      />
    ),
    onChangeText: (text) => console.log("Text changed:", text),
  },
};

export const Multiline: Story = {
  args: {
    label: "Message",
    placeholder: "Enter your message...",
    multiline: true,
    numberOfLines: 4,
    onChangeText: (text) => console.log("Text changed:", text),
  },
};
