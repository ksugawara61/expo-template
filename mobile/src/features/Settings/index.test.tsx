import { useAuth } from "@clerk/clerk-expo";
import { composeStories } from "@storybook/react-native-web-vite";
import { render, screen } from "@/libs/test/testing-library";
import * as stories from "./stories";

const { Default } = composeStories(stories);

describe("Settings", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signOut: jest.fn().mockResolvedValue(undefined),
    });
  });

  it("should render license list item", async () => {
    await render(<Default />);

    expect(screen.getByText("ライセンス一覧")).toBeOnTheScreen();
  });

  it("should render logout button", async () => {
    await render(<Default />);

    expect(screen.getByText("ログアウト")).toBeOnTheScreen();
  });
});
