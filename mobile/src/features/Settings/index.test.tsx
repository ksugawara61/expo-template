import { composeStories } from "@storybook/react-native-web-vite";
import { render, screen } from "@/libs/test/testing-library";
import * as stories from "./stories";

const { Default } = composeStories(stories);

jest.mock("@clerk/clerk-expo", () => {
  const originalModule = jest.requireActual("@clerk/clerk-expo");
  return {
    ...originalModule,
    useSignIn: () => ({
      signIn: jest.fn().mockResolvedValue(undefined),
      setActive: jest.fn().mockResolvedValue(undefined),
    }),
    useSignUp: () => ({
      signUp: jest.fn().mockResolvedValue(undefined),
      setActive: jest.fn().mockResolvedValue(undefined),
    }),
  };
});

describe("Settings", () => {
  it("should render license list item", async () => {
    await render(<Default />);

    expect(screen.getByText("ライセンス一覧")).toBeOnTheScreen();
  });

  it("should render logout button", async () => {
    await render(<Default />);

    expect(screen.getByText("ログアウト")).toBeOnTheScreen();
  });
});
