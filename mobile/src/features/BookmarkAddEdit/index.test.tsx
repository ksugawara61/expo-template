import { composeStories } from "@storybook/react";
import { render, screen } from "@/libs/test/testing-library";
import * as stories from "./stories";

const { Create, Edit } = composeStories(stories);

describe("BookmarkAddEdit", () => {
  it("新規作成画面が正しく表示される", async () => {
    await render(<Create />);

    expect(screen.getByText("ブックマークを作成")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("URLを入力")).toBeOnTheScreen();
  });

  it("編集画面が正しく表示される", async () => {
    await render(<Edit />);

    expect(screen.getByText("ブックマークを編集")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("https://example.com")).toBeOnTheScreen();
  });
});
