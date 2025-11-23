import { useLogin } from "@/libs/store/authToken";
import { render, screen, userEvent } from "@/libs/test/testing-library";
import { Login } from ".";

jest.mock("@/libs/store/authToken");

describe("Login", () => {
  it("ログインフォームが正しく表示されてログインできること", async () => {
    const mockUseLogin = useLogin as jest.Mock<ReturnType<typeof useLogin>>;
    const mockTestLogin = jest.fn();
    mockUseLogin.mockReturnValue({
      login: jest.fn(),
      testLogin: mockTestLogin,
    });
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
    expect(mockTestLogin).toHaveBeenCalledWith({
      userId: "testuser",
      testKey: "testkey",
    });
  });
});
