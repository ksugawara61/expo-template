import { atom } from "jotai";
import { updateAuthHeaders } from "@/libs/graphql/urql";

export interface AuthState {
  userId: string | null;
  testKey: string | null;
  isLoggedIn: boolean;
}

const initialAuthState: AuthState = {
  userId: null,
  testKey: null,
  isLoggedIn: false,
};

// 基本的な認証状態を保持するatom
export const authStateAtom = atom<AuthState>(initialAuthState);

// ログイン処理を行うwrite-only atom
export const loginAtom = atom(
  null,
  (_get, set, { userId, testKey }: { userId: string; testKey: string }) => {
    const newState: AuthState = {
      userId,
      testKey,
      isLoggedIn: true,
    };
    set(authStateAtom, newState);
    // GraphQLクライアントのヘッダーを更新
    updateAuthHeaders(userId, testKey);
  },
);

// ログアウト処理を行うwrite-only atom
export const logoutAtom = atom(null, (_get, set) => {
  set(authStateAtom, initialAuthState);
  // GraphQLクライアントのヘッダーをクリア
  updateAuthHeaders(null, null);
});

// テストログイン処理を行うwrite-only atom
export const testLoginAtom = atom(null, (_get, set) => {
  set(loginAtom, { userId: "test-user", testKey: "test-key" });
});

// 認証状態を読み取るための便利なatom
export const isLoggedInAtom = atom((get) => get(authStateAtom).isLoggedIn);
export const userIdAtom = atom((get) => get(authStateAtom).userId);
export const testKeyAtom = atom((get) => get(authStateAtom).testKey);
