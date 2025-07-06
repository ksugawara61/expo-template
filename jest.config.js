module.exports = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // react-native-webviewでエラーになるのでワークアラウンド対応
    // ref: https://github.com/react-native-webview/react-native-webview/issues/3233#issuecomment-1899986761
    "react-native-webview":
      "<rootDir>/node_modules/react-native-webview/src/index.ts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  clearMocks: true,
  randomize: true,
};
