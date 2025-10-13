import { composeStories } from "@storybook/react";
import { server } from "@/libs/test/server";
import { render, screen } from "@/libs/test/testing-library";
import { MocksBookmarks } from "./mocks";
import * as stories from "./stories";

const { Success, Empty } = composeStories(stories);

describe("Bookmarks", () => {
  it("ブックマークが正しく表示される", async () => {
    server.use(MocksBookmarks.success);
    await render(<Success />);

    expect(
      await screen.findByText("React NativeとExpoで始めるモバイルアプリ開発"),
    ).toBeOnTheScreen();
  });

  it("ブックマークがない場合のメッセージが表示される", async () => {
    server.use(MocksBookmarks.empty);
    await render(<Empty />);

    expect(
      await screen.findByText("ブックマークがありません"),
    ).toBeOnTheScreen();
  });
});
