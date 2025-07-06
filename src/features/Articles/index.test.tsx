import { server } from "@/libs/test/server";
import { render, screen } from "@/libs/test/testing-library";
import { Articles } from ".";
import { handlers } from "./index.mocks";

describe("Articles", () => {
  it("複数の記事が正しく表示される", async () => {
    server.use(handlers.Success);
    await render(<Articles />);

    expect(
      await screen.findByText("React NativeとExpoで始めるモバイルアプリ開発"),
    ).toBeOnTheScreen();
  });
});
