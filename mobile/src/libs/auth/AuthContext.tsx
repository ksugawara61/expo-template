import { createContext, type ReactNode, useContext, useState } from "react";

interface AuthState {
  userId: string | null;
  testKey: string | null;
  isLoggedIn: boolean;
}

interface AuthContextType {
  authState: AuthState;
  login: (userId: string, testKey: string) => void;
  logout: () => void;
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
  };

  const logout = () => {
    setAuthState({
      userId: null,
      testKey: null,
      isLoggedIn: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
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
