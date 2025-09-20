module.exports = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // react-native-webviewでエラーになるのでワークアラウンド対応
    // ref: https://github.com/react-native-webview/react-native-webview/issues/3233#issuecomment-1899986761
    "react-native-webview":
      "<rootDir>/node_modules/react-native-webview/src/index.ts",
    "^msw/node$": "<rootDir>/node_modules/msw/node",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|msw|@mswjs)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/graphql/",
  ],
  clearMocks: true,
  randomize: true,
  setupFiles: ['<rootDir>/jest.env.js'],
};
