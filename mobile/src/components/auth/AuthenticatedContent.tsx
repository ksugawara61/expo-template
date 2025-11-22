import { useAuth } from "@clerk/clerk-expo";
import LoginScreen from "../../../app/login";

interface AuthenticatedContentProps {
  children: React.ReactNode;
}

export const AuthenticatedContent = ({
  children,
}: AuthenticatedContentProps) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <LoginScreen />;
  }

  return children;
};
