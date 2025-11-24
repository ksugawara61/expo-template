import { useAuth, useSignIn, useSignUp as useClerkSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { atomWithSecureStore } from "./jotai";

type TestAuthToken = {
  __typename: "test";
  userId: string;
  testKey: string;
};

export type AuthToken =
  | {
      __typename: "session";
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

  const { signIn, isLoaded, setActive } = useSignIn();
  const { isSignedIn, getToken } = useAuth();
  const login = useCallback(
    async (identifier: string, password: string) => {
      if (!isLoaded || !setActive) {
        return;
      }

      const signInAttempt = await signIn.create({
        identifier,
        password,
      });

      if (signInAttempt.status !== "complete") {
        throw new Error("Sign-in not complete");
      }

      const sessionToken = signInAttempt.createdSessionId;
      await setActive({ session: sessionToken });
    },
    [signIn, isLoaded, setActive],
  );
  useEffect(() => {
    if (isSignedIn) {
      void getToken().then((token) => {
        setAuthToken({ __typename: "session", token });
      });
    }
  }, [isSignedIn, getToken, setAuthToken]);

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
  const { signOut } = useAuth();
  const setAuthToken = useSetAtom(authTokenAtom);

  const logout = useCallback(async () => {
    setAuthToken(null);
    await signOut();
    router.replace("/login");
  }, [setAuthToken, signOut]);

  return logout;
};

export const useSignUp = () => {
  const { signUp, isLoaded, setActive } = useClerkSignUp();

  const signUpFn = useCallback(
    async (email: string, password: string) => {
      if (!isLoaded || !signUp) {
        throw new Error("SignUp is not loaded");
      }

      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    },
    [signUp, isLoaded],
  );

  const verifySignUp = useCallback(
    async (code: string) => {
      if (!isLoaded || !signUp || !setActive) {
        throw new Error("SignUp is not loaded");
      }

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status !== "complete") {
        throw new Error("Sign-up verification not complete");
      }

      const sessionToken = signUpAttempt.createdSessionId;
      await setActive({ session: sessionToken });
    },
    [signUp, isLoaded, setActive],
  );

  return {
    signUp: signUpFn,
    verifySignUp,
  };
};
