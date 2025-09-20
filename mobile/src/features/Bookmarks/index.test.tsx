import { composeStories } from "@storybook/react";
import { render, screen } from "@/libs/test/testing-library";
import * as stories from "./index.stories";

const { Success, Empty } = composeStories(stories);

describe("Bookmarks", () => {
  it("ブックマークが正しく表示される", async () => {
    render(<Success />);

    expect(
      await screen.findByText("React NativeとExpoで始めるモバイルアプリ開発"),
    ).toBeOnTheScreen();
  });

  it("ブックマークがない場合のメッセージが表示される", async () => {
    render(<Empty />);

    expect(
      await screen.findByText("ブックマークがありません"),
    ).toBeOnTheScreen();
  });
});
