import { createStore } from "jotai";
import {
  authStateAtom,
  isLoggedInAtom,
  loginAtom,
  logoutAtom,
  testKeyAtom,
  testLoginAtom,
  userIdAtom,
} from "./authAtoms";

describe("authAtoms", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    // 各テストの前に新しいストアを作成
    store = createStore();
  });

  describe("authStateAtom", () => {
    it("初期状態が正しく設定されている", () => {
      const state = store.get(authStateAtom);
      expect(state).toEqual({
        userId: null,
        testKey: null,
        isLoggedIn: false,
      });
    });
  });

  describe("loginAtom", () => {
    it("ログイン処理が正しく動作する", () => {
      const userId = "user123";
      const testKey = "key456";

      store.set(loginAtom, { userId, testKey });

      const state = store.get(authStateAtom);
      expect(state).toEqual({
        userId,
        testKey,
        isLoggedIn: true,
      });
    });
  });

  describe("logoutAtom", () => {
    it("ログアウト処理が正しく動作する", () => {
      // 最初にログイン
      store.set(loginAtom, { userId: "user123", testKey: "key456" });

      // ログアウト
      store.set(logoutAtom);

      const state = store.get(authStateAtom);
      expect(state).toEqual({
        userId: null,
        testKey: null,
        isLoggedIn: false,
      });
    });
  });

  describe("testLoginAtom", () => {
    it("テストログイン処理が正しく動作する", () => {
      store.set(testLoginAtom);

      const state = store.get(authStateAtom);
      expect(state).toEqual({
        userId: "test-user",
        testKey: "test-key",
        isLoggedIn: true,
      });
    });
  });

  describe("派生atom", () => {
    it("isLoggedInAtomが正しく動作する", () => {
      expect(store.get(isLoggedInAtom)).toBe(false);

      store.set(loginAtom, { userId: "user123", testKey: "key456" });
      expect(store.get(isLoggedInAtom)).toBe(true);

      store.set(logoutAtom);
      expect(store.get(isLoggedInAtom)).toBe(false);
    });

    it("userIdAtomが正しく動作する", () => {
      expect(store.get(userIdAtom)).toBeNull();

      const userId = "user123";
      store.set(loginAtom, { userId, testKey: "key456" });
      expect(store.get(userIdAtom)).toBe(userId);

      store.set(logoutAtom);
      expect(store.get(userIdAtom)).toBeNull();
    });

    it("testKeyAtomが正しく動作する", () => {
      expect(store.get(testKeyAtom)).toBeNull();

      const testKey = "key456";
      store.set(loginAtom, { userId: "user123", testKey });
      expect(store.get(testKeyAtom)).toBe(testKey);

      store.set(logoutAtom);
      expect(store.get(testKeyAtom)).toBeNull();
    });
  });
});
