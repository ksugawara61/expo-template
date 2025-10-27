import {
  useAuth as useClerkAuth,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { updateAuthHeaders } from "@/libs/graphql/urql";

interface AuthState {
  userId: string | null;
  testKey: string | null;
  isLoggedIn: boolean;
  clerkToken: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (userId: string, testKey: string) => void;
  logout: () => void;
  testLogin: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { signOut, getToken, isSignedIn, userId } = useClerkAuth();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const [authState, setAuthState] = useState<AuthState>({
    userId: null,
    testKey: null,
    isLoggedIn: false,
    clerkToken: null,
  });

  // Clerk認証状態の変更を監視
  useEffect(() => {
    const updateAuthState = async () => {
      if (isSignedIn && userId) {
        try {
          const token = await getToken();
          setAuthState({
            userId,
            testKey: null,
            isLoggedIn: true,
            clerkToken: token,
          });
          // GraphQLクライアントのヘッダーを更新（Clerk認証の場合）
          updateAuthHeaders(null, null, token);
        } catch (error) {
          console.error("Failed to get token:", error);
        }
      } else {
        setAuthState({
          userId: null,
          testKey: null,
          isLoggedIn: false,
          clerkToken: null,
        });
        // GraphQLクライアントのヘッダーをクリア
        updateAuthHeaders(null, null);
      }
    };

    void updateAuthState();
  }, [isSignedIn, userId, getToken]);

  const login = (userId: string, testKey: string) => {
    setAuthState({
      userId,
      testKey,
      isLoggedIn: true,
      clerkToken: null,
    });
    // GraphQLクライアントのヘッダーを更新（テスト認証の場合）
    updateAuthHeaders(userId, testKey);
  };

  const logout = async () => {
    await signOut();
    setAuthState({
      userId: null,
      testKey: null,
      isLoggedIn: false,
      clerkToken: null,
    });
    // GraphQLクライアントのヘッダーをクリア
    updateAuthHeaders(null, null);
  };

  const testLogin = () => {
    login("test-user", "test-key");
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!signInLoaded || !signIn) {
      throw new Error("Sign in not loaded");
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Sign in completed successfully
        return;
      }
      throw new Error("Sign in not completed");
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!signUpLoaded || !signUp) {
      throw new Error("Sign up not loaded");
    }

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === "complete") {
        // Sign up completed successfully
        return;
      }
      throw new Error("Sign up not completed");
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        testLogin,
        signInWithEmail,
        signUpWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
