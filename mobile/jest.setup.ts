import { server } from "@/libs/test/server";

// storybook 9 からエラーになるので、設定を追加
// ref: https://github.com/storybookjs/react-native/blob/c2958ff792ab9cfed0739fdaf5b2418662138dff/examples/expo-example/setup-jest.ts#L4
// @ts-ignore
global.window.navigator = {};

jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };
  return module;
});

jest.mock("@clerk/clerk-expo", () => ({
  useAuth: jest.fn(() => ({
    isSignedIn: true,
    signOut: jest.fn(),
  })),
  useSignIn: jest.fn(() => ({
    isLoaded: true,
    signIn: {
      create: jest.fn(),
    },
    setActive: jest.fn(),
  })),
  useSignUp: jest.fn(() => ({
    isLoaded: true,
    signUp: {
      create: jest.fn(),
      prepareEmailAddressVerification: jest.fn(),
      attemptEmailAddressVerification: jest.fn(),
    },
    setActive: jest.fn(),
  })),
  useOAuth: jest.fn(() => ({
    startOAuthFlow: jest.fn(),
  })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  tokenCache: {},
}));

beforeAll(() => {
  server.listen();
});

beforeEach(async () => {
  jest.useFakeTimers();
});

afterEach(async () => {
  server.resetHandlers();
  jest.useRealTimers();
});

afterAll(() => {
  server.close();
});
