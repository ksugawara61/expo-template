import { act, renderHook } from "@testing-library/react-native";
import type React from "react";
import { AuthProvider, useAuth } from "./AuthContext";

// updateAuthHeaders関数のモック
jest.mock("@/libs/graphql/urql", () => ({
  updateAuthHeaders: jest.fn(),
}));

import { updateAuthHeaders } from "@/libs/graphql/urql";

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe("useAuth", () => {
    it("初期状態が正しく設定されている", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.authState).toEqual({
        userId: null,
        testKey: null,
        isLoggedIn: false,
      });
    });

    it("login関数が正しく動作する", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(() => result.current.login("user123", "key456"));

      expect(result.current.authState).toEqual({
        userId: "user123",
        testKey: "key456",
        isLoggedIn: true,
      });

      expect(updateAuthHeaders).toHaveBeenCalledWith("user123", "key456");
    });

    it("logout関数が正しく動作する", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // 最初にログイン
      await act(() => result.current.login("user123", "key456"));

      // ログアウト
      await act(() => result.current.logout());

      expect(result.current.authState).toEqual({
        userId: null,
        testKey: null,
        isLoggedIn: false,
      });

      expect(updateAuthHeaders).toHaveBeenCalledWith(null, null);
    });

    it("testLogin関数が正しく動作する", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(() => result.current.testLogin());

      expect(result.current.authState).toEqual({
        userId: "test-user",
        testKey: "test-key",
        isLoggedIn: true,
      });

      expect(updateAuthHeaders).toHaveBeenCalledWith("test-user", "test-key");
    });

    it("複数回のログイン/ログアウトが正しく動作する", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // 1回目のログイン
      await act(() => result.current.login("user1", "key1"));
      expect(result.current.authState.userId).toBe("user1");

      // ログアウト
      await act(() => result.current.logout());
      expect(result.current.authState.isLoggedIn).toBe(false);

      // 2回目のログイン
      await act(() => result.current.login("user2", "key2"));
      expect(result.current.authState.userId).toBe("user2");
      expect(result.current.authState.isLoggedIn).toBe(true);
    });
  });
});
