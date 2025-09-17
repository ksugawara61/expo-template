import { composeStories } from "@storybook/react";
import { server } from "@/libs/test/server";
import { render, screen } from "@/libs/test/testing-library";
import { handlers } from "./index.mocks";
import * as stories from "./index.stories";

const { Primary } = composeStories(stories);

describe("Articles", () => {
  it("複数の記事が正しく表示される", async () => {
    server.use(...handlers.Success);
    await render(<Primary />);

    expect(
      await screen.findByText("React NativeとExpoで始めるモバイルアプリ開発"),
    ).toBeOnTheScreen();
  });
});
