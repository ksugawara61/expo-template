import { Provider, useAtomValue, useSetAtom } from "jotai";
import { type ReactNode, useCallback } from "react";
import {
  type AuthState,
  authStateAtom,
  loginAtom,
  logoutAtom,
  testLoginAtom,
} from "./authAtoms";

interface AuthContextType {
  authState: AuthState;
  login: (userId: string, testKey: string) => void;
  logout: () => void;
  testLogin: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <Provider>{children}</Provider>;
};

export const useAuth = (): AuthContextType => {
  const authState = useAtomValue(authStateAtom);
  const setLogin = useSetAtom(loginAtom);
  const setLogout = useSetAtom(logoutAtom);
  const setTestLogin = useSetAtom(testLoginAtom);

  const login = useCallback(
    (userId: string, testKey: string) => {
      setLogin({ userId, testKey });
    },
    [setLogin],
  );

  const logout = useCallback(() => {
    setLogout();
  }, [setLogout]);

  const testLogin = useCallback(() => {
    setTestLogin();
  }, [setTestLogin]);

  return { authState, login, logout, testLogin };
};
