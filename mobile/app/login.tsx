import { Redirect } from "expo-router";
import { Login } from "@/features/Login";
import { useIsLoggedIn } from "@/libs/store/authToken";

export default () => {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return <Login />;
};
