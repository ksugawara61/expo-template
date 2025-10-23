import { createContext, type ReactNode, useContext, useState } from "react";
import { updateAuthHeaders } from "@/libs/graphql/urql";

interface AuthState {
  userId: string | null;
  testKey: string | null;
  isLoggedIn: boolean;
}

interface AuthContextType {
  authState: AuthState;
  login: (userId: string, testKey: string) => void;
  logout: () => void;
  testLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    userId: null,
    testKey: null,
    isLoggedIn: false,
  });

  const login = (userId: string, testKey: string) => {
    setAuthState({
      userId,
      testKey,
      isLoggedIn: true,
    });
    // GraphQLクライアントのヘッダーを更新
    updateAuthHeaders(userId, testKey);
  };

  const logout = () => {
    setAuthState({
      userId: null,
      testKey: null,
      isLoggedIn: false,
    });
    // GraphQLクライアントのヘッダーをクリア
    updateAuthHeaders(null, null);
  };

  const testLogin = () => {
    login("test-user", "test-key");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, testLogin }}>
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
