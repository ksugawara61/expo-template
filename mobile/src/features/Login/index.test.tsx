import { useAuth } from "@/libs/auth/AuthContext";
import { render, screen, userEvent } from "@/libs/test/testing-library";
import { Login } from ".";

jest.mock("@/libs/auth/AuthContext");

describe("Login", () => {
  it("ログインフォームが正しく表示されてログインできること", async () => {
    const mockUseAuth = useAuth as jest.Mock<ReturnType<typeof useAuth>>;
    const mockLogin = jest.fn();
    mockUseAuth.mockReturnValue({ login: mockLogin } as unknown as ReturnType<
      typeof useAuth
    >);
    await render(<Login />);

    expect(
      await screen.findByText("GraphQL APIの認証情報を入力してください"),
    ).toBeOnTheScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "ログイン" }));

    expect(
      screen.getByRole("text", { name: "ユーザーIDは必須です" }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("text", { name: "認証キーは必須です" }),
    ).toBeOnTheScreen();

    await user.paste(screen.getByLabelText("ユーザーID"), "testuser");
    await user.paste(screen.getByLabelText("認証キー"), "testkey");

    expect(
      screen.queryByRole("text", { name: "ユーザーIDは必須です" }),
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByRole("text", { name: "認証キーは必須です" }),
    ).not.toBeOnTheScreen();

    await user.press(screen.getByRole("button", { name: "ログイン" }));
    expect(mockLogin).toHaveBeenCalledWith("testuser", "testkey");
  });
});
