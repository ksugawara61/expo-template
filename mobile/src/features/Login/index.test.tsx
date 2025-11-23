import { useSignIn } from "@clerk/clerk-expo";
import { useLogin } from "@/libs/store/authToken";
import { render, screen, userEvent } from "@/libs/test/testing-library";
import { Login } from ".";

jest.mock("@clerk/clerk-expo");
jest.mock("@/libs/store/authToken");
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe("Login", () => {
  beforeEach(() => {
    const mockUseSignIn = useSignIn as jest.Mock<ReturnType<typeof useSignIn>>;
    mockUseSignIn.mockReturnValue({
      signIn: {
        create: jest.fn(),
      } as ReturnType<typeof useSignIn>["signIn"],
      setActive: jest.fn(),
      isLoaded: true,
    });
  });

  it("ログインフォームが正しく表示されてGraphQL API認証でログインできること", async () => {
    const mockUseLogin = useLogin as jest.Mock<ReturnType<typeof useLogin>>;
    const mockTestLogin = jest.fn();
    mockUseLogin.mockReturnValue({
      login: jest.fn(),
      testLogin: mockTestLogin,
    });
    await render(<Login />);

    expect(
      await screen.findByText(
        "メールアドレスでログイン、またはGraphQL APIの認証情報を入力してください",
      ),
    ).toBeOnTheScreen();

    const user = userEvent.setup();
    await user.press(
      screen.getByRole("button", { name: "GraphQL API認証でログイン" }),
    );

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

    await user.press(
      screen.getByRole("button", { name: "GraphQL API認証でログイン" }),
    );
    expect(mockTestLogin).toHaveBeenCalledWith({
      userId: "testuser",
      testKey: "testkey",
    });
  });
});
