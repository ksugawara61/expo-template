import { Alert } from "react-native";
import { render, screen } from "@/libs/test/testing-library";
import LoginScreen from "./login";

// Alert をモック
jest.spyOn(Alert, "alert");

// Clerk hooks をモック - 簡略化
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
}));

// AuthContext をモック
jest.mock("@/libs/auth/AuthContext", () => ({
  useAuth: () => ({
    authState: {
      userId: null,
      testKey: null,
      isLoggedIn: false,
      clerkToken: null,
    },
    login: jest.fn(),
    logout: jest.fn(),
    testLogin: jest.fn(),
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// ClerkProvider をモック
jest.mock("@/libs/auth/ClerkProvider", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// jotai をモック
jest.mock("jotai", () => ({
  useAtomValue: () => ({
    userId: null,
    testKey: null,
    isLoggedIn: false,
    clerkToken: null,
  }),
  useSetAtom: () => jest.fn(),
  Provider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ログイン画面が正しく表示される", async () => {
    await render(<LoginScreen />);

    expect(screen.getByText("アプリにログインしてください")).toBeOnTheScreen();
    expect(screen.getByText("メールログイン")).toBeOnTheScreen();
    expect(screen.getByText("テスト認証")).toBeOnTheScreen();
  });

  it("メールログインタブが選択されている時、メールフォームが表示される", async () => {
    await render(<LoginScreen />);

    // Check form elements are present
    expect(screen.getByText("アカウント作成に切り替え")).toBeOnTheScreen();
    expect(screen.getAllByTestId("text-input-outlined")).toHaveLength(2); // email and password fields
  });

  it("開発環境でクイックテストログインボタンが表示される", async () => {
    // __DEV__ をtrueに設定
    // biome-ignore lint/suspicious/noExplicitAny: テスト用のグローバル変数設定
    (global as any).__DEV__ = true;

    await render(<LoginScreen />);

    expect(
      screen.getByText("開発環境用（デフォルトのテスト用認証情報でログイン）"),
    ).toBeOnTheScreen();
    expect(screen.getByText("クイックテストログイン")).toBeOnTheScreen();
  });
});
