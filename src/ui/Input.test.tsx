import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react-native";
import * as stories from "./Input.stories";

const { Primary } = composeStories(stories);

describe("Input", () => {
  it("renders correctly", () => {
    render(<Primary />);
    expect(screen.getByPlaceholderText("useless placeholder")).toBeTruthy();
  });
});
