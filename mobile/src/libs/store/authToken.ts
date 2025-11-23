import { router } from "expo-router";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

const authTokenAtom = atom<string | null>(null);

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
      setAuthToken(token);
    },
    [setAuthToken],
  );

  const testLogin = useCallback(() => {
    setAuthToken("test-token");
  }, [setAuthToken]);

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
