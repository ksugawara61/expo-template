import { useAuth } from "@clerk/clerk-expo";
import { useSignUp } from "@/libs/store/authToken";
import { render, screen, userEvent } from "@/libs/test/testing-library";
import { SignUp } from ".";

jest.mock("@/libs/store/authToken");

describe("SignUp", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      getToken: jest.fn().mockResolvedValue("mock-session-token"),
      signOut: jest.fn().mockResolvedValue(undefined),
    });
  });

  it("サインアップフォームが正しく表示されること", async () => {
    const mockUseSignUp = useSignUp as jest.Mock<ReturnType<typeof useSignUp>>;
    mockUseSignUp.mockReturnValue({
      signUp: jest.fn(),
      verifySignUp: jest.fn(),
    });

    await render(<SignUp />);

    expect(
      await screen.findByText(
        "メールアドレスとパスワードを入力してアカウントを作成",
      ),
    ).toBeOnTheScreen();

    // フォーム項目が表示されることを確認
    expect(screen.getByLabelText("メールアドレス")).toBeOnTheScreen();
    expect(screen.getByLabelText("パスワード")).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: "サインアップ" }),
    ).toBeOnTheScreen();
  });

  it("バリデーションエラーが表示されること", async () => {
    const mockUseSignUp = useSignUp as jest.Mock<ReturnType<typeof useSignUp>>;
    mockUseSignUp.mockReturnValue({
      signUp: jest.fn(),
      verifySignUp: jest.fn(),
    });

    await render(<SignUp />);

    const user = userEvent.setup();

    // サインアップボタンを押す
    await user.press(screen.getByRole("button", { name: "サインアップ" }));

    expect(
      screen.getByRole("text", { name: "メールアドレスは必須です" }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("text", {
        name: "パスワードは8文字以上で入力してください",
      }),
    ).toBeOnTheScreen();
  });

  it("無効なメールアドレスの場合にバリデーションエラーが表示されること", async () => {
    const mockUseSignUp = useSignUp as jest.Mock<ReturnType<typeof useSignUp>>;
    mockUseSignUp.mockReturnValue({
      signUp: jest.fn(),
      verifySignUp: jest.fn(),
    });

    await render(<SignUp />);

    const user = userEvent.setup();

    // 無効なメールアドレスを入力
    await user.type(screen.getByLabelText("メールアドレス"), "invalid-email");
    await user.type(screen.getByLabelText("パスワード"), "password123");

    // サインアップボタンを押す
    await user.press(screen.getByRole("button", { name: "サインアップ" }));

    expect(
      screen.getByRole("text", {
        name: "有効なメールアドレスを入力してください",
      }),
    ).toBeOnTheScreen();
  });

  it("ログイン画面への遷移リンクが表示されること", async () => {
    const mockUseSignUp = useSignUp as jest.Mock<ReturnType<typeof useSignUp>>;
    mockUseSignUp.mockReturnValue({
      signUp: jest.fn(),
      verifySignUp: jest.fn(),
    });

    await render(<SignUp />);

    expect(
      await screen.findByRole("button", {
        name: "既にアカウントをお持ちですか? ログイン",
      }),
    ).toBeOnTheScreen();
  });
});
