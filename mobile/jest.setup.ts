import { server } from "@/libs/test/server";

// Force development mode for React to enable act()
Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
// @ts-ignore
global.__DEV__ = true;

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
