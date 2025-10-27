import { Provider as JotaiProvider } from "jotai";
import { Alert } from "react-native";
import { AuthProvider } from "@/libs/auth/AuthContext";
import { ClerkProvider } from "@/libs/auth/ClerkProvider";
import { render, screen, waitFor } from "@/libs/test/testing-library";
import LoginScreen from "./login";

// Alert をモック
jest.spyOn(Alert, "alert");

// Clerk hooks をモック
jest.mock("@clerk/clerk-expo", () => ({
  useAuth: () => ({
    signOut: jest.fn(),
    getToken: jest.fn().mockResolvedValue("mock-token"),
    isSignedIn: false,
    userId: null,
  }),
  useSignIn: () => ({
    signIn: {
      create: jest.fn().mockResolvedValue({ status: "complete" }),
    },
    isLoaded: true,
  }),
  useSignUp: () => ({
    signUp: {
      create: jest.fn().mockResolvedValue({ status: "complete" }),
    },
    isLoaded: true,
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// 環境変数をモック
process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_mock_key";

// ClerkProvider を直接モック
jest.mock("@/libs/auth/ClerkProvider", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <JotaiProvider>
    <ClerkProvider>
      <AuthProvider>{children}</AuthProvider>
    </ClerkProvider>
  </JotaiProvider>
);

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ログイン画面が正しく表示される", async () => {
    await render(
      <TestWrapper>
        <LoginScreen />
      </TestWrapper>,
    );

    expect(screen.getByText("ログイン")).toBeOnTheScreen();
    expect(screen.getByText("アプリにログインしてください")).toBeOnTheScreen();
    expect(screen.getByText("メールログイン")).toBeOnTheScreen();
    expect(screen.getByText("テスト認証")).toBeOnTheScreen();
  });

  it("メールログインタブが選択されている時、メールフォームが表示される", async () => {
    await render(
      <TestWrapper>
        <LoginScreen />
      </TestWrapper>,
    );

    expect(screen.getByLabelText("メールアドレス")).toBeOnTheScreen();
    expect(screen.getByLabelText("パスワード")).toBeOnTheScreen();
    expect(screen.getByText("アカウント作成に切り替え")).toBeOnTheScreen();
    expect(screen.getByText("ログイン")).toBeOnTheScreen();
  });

  it("テスト認証タブを選択すると、テスト認証フォームが表示される", async () => {
    await render(
      <TestWrapper>
        <LoginScreen />
      </TestWrapper>,
    );

    const testAuthButton = screen.getByText("テスト認証");
    testAuthButton.props.onPress();

    await waitFor(() => {
      expect(screen.getByLabelText("ユーザーID")).toBeOnTheScreen();
      expect(screen.getByLabelText("認証キー")).toBeOnTheScreen();
    });
  });

  it("メールアドレスとパスワードが空の場合、エラーメッセージが表示される", async () => {
    await render(
      <TestWrapper>
        <LoginScreen />
      </TestWrapper>,
    );

    const loginButton = screen.getByRole("button", { name: "ログイン" });
    loginButton.props.onPress();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "エラー",
        "メールアドレスとパスワードを入力してください",
      );
    });
  });

  it("テスト認証でユーザーIDとテストキーが空の場合、エラーメッセージが表示される", async () => {
    await render(
      <TestWrapper>
        <LoginScreen />
      </TestWrapper>,
    );

    const testAuthButton = screen.getByText("テスト認証");
    testAuthButton.props.onPress();

    await waitFor(() => {
      const loginButton = screen.getByRole("button", { name: "ログイン" });
      loginButton.props.onPress();
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "エラー",
        "ユーザーIDとテストキーを入力してください",
      );
    });
  });

  it("アカウント作成に切り替えボタンが正しく動作する", async () => {
    await render(
      <TestWrapper>
        <LoginScreen />
      </TestWrapper>,
    );

    const toggleButton = screen.getByText("アカウント作成に切り替え");
    toggleButton.props.onPress();

    await waitFor(() => {
      expect(screen.getByText("ログインに切り替え")).toBeOnTheScreen();
      expect(screen.getByText("アカウント作成")).toBeOnTheScreen();
    });
  });

  it("開発環境でクイックテストログインボタンが表示される", async () => {
    // __DEV__ をtrueに設定
    // biome-ignore lint/suspicious/noExplicitAny: テスト用のグローバル変数設定
    (global as any).__DEV__ = true;

    await render(
      <TestWrapper>
        <LoginScreen />
      </TestWrapper>,
    );

    expect(
      screen.getByText("開発環境用（デフォルトのテスト用認証情報でログイン）"),
    ).toBeOnTheScreen();
    expect(screen.getByText("クイックテストログイン")).toBeOnTheScreen();
  });
});
