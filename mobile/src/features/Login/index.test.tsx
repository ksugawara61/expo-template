import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { useLogin } from "@/libs/store/authToken";
import { render, screen, userEvent } from "@/libs/test/testing-library";
import { Login } from ".";

jest.mock("@/libs/store/authToken");

describe("Login", () => {
  beforeEach(() => {
    (useSignIn as jest.Mock).mockReturnValue({
      signIn: {
        create: jest.fn(),
      },
      isLoaded: true,
      setActive: jest.fn(),
    });
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      getToken: jest.fn().mockResolvedValue("mock-session-token"),
      signOut: jest.fn().mockResolvedValue(undefined),
    });
  });

  it("テストログインタブでログインフォームが正しく表示されること", async () => {
    const mockUseLogin = useLogin as jest.Mock<ReturnType<typeof useLogin>>;
    const mockTestLogin = jest.fn();
    mockUseLogin.mockReturnValue({
      login: jest.fn(),
      testLogin: mockTestLogin,
    });
    await render(<Login />);

    const user = userEvent.setup();

    // テストログインタブに切り替え
    await user.press(screen.getByRole("button", { name: "テストログイン" }));

    expect(
      await screen.findByText("GraphQL APIの認証情報を入力してください"),
    ).toBeOnTheScreen();

    // フォーム項目が表示されることを確認
    expect(screen.getByLabelText("ユーザーID")).toBeOnTheScreen();
    expect(screen.getByLabelText("認証キー")).toBeOnTheScreen();

    // バリデーションエラーが表示されることを確認
    await user.press(screen.getByRole("button", { name: "ログイン" }));

    expect(
      screen.getByRole("text", { name: "ユーザーIDは必須です" }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("text", { name: "認証キーは必須です" }),
    ).toBeOnTheScreen();
  });

  it("Emailログインタブでログインフォームが正しく表示されること", async () => {
    const mockUseLogin = useLogin as jest.Mock<ReturnType<typeof useLogin>>;
    mockUseLogin.mockReturnValue({
      login: jest.fn(),
      testLogin: jest.fn(),
    });
    await render(<Login />);

    // デフォルトでEmailログインタブが表示される
    expect(
      await screen.findByText("メールアドレスとパスワードを入力してログイン"),
    ).toBeOnTheScreen();

    const user = userEvent.setup();
    await user.press(screen.getByRole("button", { name: "ログイン" }));

    expect(
      screen.getByRole("text", { name: "メールアドレスは必須です" }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("text", { name: "パスワードは必須です" }),
    ).toBeOnTheScreen();
  });
});
