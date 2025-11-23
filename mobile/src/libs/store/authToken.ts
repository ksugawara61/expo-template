import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { atomWithSecureStore } from "./jotai";

type TestAuthToken = {
  __typename: "test";
  userId: string;
  testKey: string;
};

export type AuthToken =
  | {
      __typename: "production";
      token: string;
    }
  | TestAuthToken
  | null;

const authTokenAtom = atomWithSecureStore<AuthToken>("authToken", null);

export const useAuthToken = () => {
  const authToken = useAtomValue(authTokenAtom);
  return authToken;
};

export const useIsLoggedIn = () => {
  const authToken = useAtomValue(authTokenAtom);
  return authToken !== null;
};

export const useLogin = () => {
  const setAuthToken = useSetAtom(authTokenAtom);

  const login = useCallback(
    (token: string) => {
      setAuthToken({ __typename: "production", token });
    },
    [setAuthToken],
  );

  const testLogin = useCallback(
    (param?: Omit<TestAuthToken, "__typename">) => {
      setAuthToken({
        __typename: "test",
        userId: param?.userId ?? "test-user",
        testKey: param?.testKey ?? "test-key",
      });
    },
    [setAuthToken],
  );

  return {
    login,
    testLogin,
  };
};

export const useLogout = () => {
  const setAuthToken = useSetAtom(authTokenAtom);

  const logout = useCallback(() => {
    setAuthToken(null);
    router.replace("/login");
  }, [setAuthToken]);

  return logout;
};
