import { composeStories } from "@storybook/react";
import { renderSuspense, screen } from "@/libs/test/testing-library";
import * as stories from "./Input.stories";

const { Primary } = composeStories(stories);

describe("Input", () => {
  it("renders correctly", async () => {
    await renderSuspense(<Primary />);
    expect(screen.getByPlaceholderText("useless placeholder")).toBeTruthy();
  });
});
