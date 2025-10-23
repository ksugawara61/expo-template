import { useAuth } from "@/libs/auth/AuthContext";
import LoginScreen from "../../../app/login";

interface AuthenticatedContentProps {
  children: React.ReactNode;
}

export const AuthenticatedContent = ({
  children,
}: AuthenticatedContentProps) => {
  const { authState } = useAuth();

  if (!authState.isLoggedIn) {
    return <LoginScreen />;
  }

  return children;
};
