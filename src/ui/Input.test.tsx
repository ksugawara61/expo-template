import { composeStories } from "@storybook/react";
import { render, screen } from "@/libs/test/testing-library";
import * as stories from "./Input.stories";

const { Primary } = composeStories(stories);

describe("Input", () => {
  it("renders correctly", async () => {
    await render(<Primary />);
    expect(screen.getByPlaceholderText("useless placeholder")).toBeTruthy();
  });
});
