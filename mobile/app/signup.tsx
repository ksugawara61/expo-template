import { Redirect } from "expo-router";
import { SignUp } from "@/features/SignUp";
import { useIsLoggedIn } from "@/libs/store/authToken";

export default () => {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return <SignUp />;
};
