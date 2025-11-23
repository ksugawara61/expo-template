import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { Provider, useAtomValue, useSetAtom } from "jotai";
import { type ReactNode, useCallback } from "react";
import {
  type AuthState,
  authStateAtom,
  loginAtom,
  logoutAtom,
  testLoginAtom,
} from "./authAtoms";
import { initAuthStore } from "./authStore";

interface AuthContextType {
  authState: AuthState;
  login: (userId: string, testKey: string) => void;
  logout: () => void;
  testLogin: () => void;
  clerkEmailLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  clerkEmailSignUp: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  clerkEmailVerify: (
    code: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // グローバルストアを初期化してProviderに渡す
  const store = initAuthStore();
  return <Provider store={store}>{children}</Provider>;
};

export const useAuth = (): AuthContextType => {
  const authState = useAtomValue(authStateAtom);
  const setLogin = useSetAtom(loginAtom);
  const setLogout = useSetAtom(logoutAtom);
  const setTestLogin = useSetAtom(testLoginAtom);
  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();

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

  const clerkEmailLogin = useCallback(
    async (email: string, password: string) => {
      if (!signIn || !setActiveSignIn) {
        return { success: false, error: "Sign in not available" };
      }

      try {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          await setActiveSignIn({ session: result.createdSessionId });
          return { success: true };
        }

        return { success: false, error: "Sign in incomplete" };
      } catch (err: unknown) {
        const error = err as { errors?: Array<{ message: string }> };
        return {
          success: false,
          error: error.errors?.[0]?.message || "Sign in failed",
        };
      }
    },
    [signIn, setActiveSignIn],
  );

  const clerkEmailSignUp = useCallback(
    async (email: string, password: string) => {
      if (!signUp) {
        return { success: false, error: "Sign up not available" };
      }

      try {
        await signUp.create({
          emailAddress: email,
          password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        return { success: true };
      } catch (err: unknown) {
        const error = err as { errors?: Array<{ message: string }> };
        return {
          success: false,
          error: error.errors?.[0]?.message || "Sign up failed",
        };
      }
    },
    [signUp],
  );

  const clerkEmailVerify = useCallback(
    async (code: string) => {
      if (!signUp || !setActiveSignUp) {
        return { success: false, error: "Verification not available" };
      }

      try {
        const result = await signUp.attemptEmailAddressVerification({
          code,
        });

        if (result.status === "complete") {
          await setActiveSignUp({ session: result.createdSessionId });
          return { success: true };
        }

        return { success: false, error: "Verification incomplete" };
      } catch (err: unknown) {
        const error = err as { errors?: Array<{ message: string }> };
        return {
          success: false,
          error: error.errors?.[0]?.message || "Verification failed",
        };
      }
    },
    [signUp, setActiveSignUp],
  );

  return {
    authState,
    login,
    logout,
    testLogin,
    clerkEmailLogin,
    clerkEmailSignUp,
    clerkEmailVerify,
  };
};
