import i18n from "@/libs/i18n";

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

// Mock Apollo Client
jest.mock("@apollo/client", () => {
  const actualApollo = jest.requireActual("@apollo/client");
  return {
    ...actualApollo,
    useSuspenseQuery: jest.fn(() => ({
      data: {
        articles: [
          {
            id: "1",
            title: "React NativeとExpoで始めるモバイルアプリ開発",
            user: { name: "テストユーザー" },
            created_at: "2023-01-01",
            tags: [{ name: "React Native" }, { name: "Expo" }],
          },
        ],
      },
    })),
    useQuery: jest.fn(() => ({
      data: {
        bookmarks: [
          {
            id: "1",
            title: "React NativeとExpoで始めるモバイルアプリ開発",
            url: "https://example.com",
            description: "テスト記事",
            created_at: "2023-01-01",
            updated_at: "2023-01-01",
          },
        ],
      },
      loading: false,
      error: null,
    })),
  };
});

// React development mode for act function
jest.mock("react", () => {
  const actualReact = jest.requireActual("react");
  return {
    ...actualReact,
    act: jest.fn((callback) => {
      if (typeof callback === "function") {
        return callback();
      }
      return callback;
    }),
  };
});

beforeAll(async () => {
  // i18nextの初期化を待つ
  if (!i18n.isInitialized) {
    await i18n.init();
  }
});

beforeEach(async () => {
  jest.useFakeTimers();
});

afterEach(async () => {
  jest.useRealTimers();
});
