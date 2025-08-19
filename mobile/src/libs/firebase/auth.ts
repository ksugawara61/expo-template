import firebaseAuth, {
  connectAuthEmulator,
  getAuth,
} from "@react-native-firebase/auth";
import Constants from "expo-constants";

const auth = getAuth();

// biome-ignore lint/correctness/useHookAtTopLevel: useUserAccessGroup is not a React hook but a Firebase Auth method
auth
  .useUserAccessGroup(
    `group.${Constants.expoConfig?.ios?.bundleIdentifier ?? ""}`,
  )
  .catch((error) => console.error(error));

if (Constants.expoConfig?.extra?.firebaseEmulatorHost) {
  connectAuthEmulator(
    auth,
    `http://${Constants.expoConfig?.extra?.firebaseEmulatorHost}:9099`,
  );
}

export const isAuthorized = () => {
  return auth.currentUser !== null;
};

export const authSignInWithGoogle = async (idToken: string) => {
  const googleCredential = firebaseAuth.GoogleAuthProvider.credential(idToken);
  return await auth.signInWithCredential(googleCredential);
};

export const authSignInWithApple = async (
  idToken: string | null,
  nonce?: string,
) => {
  const appleCredential = firebaseAuth.AppleAuthProvider.credential(
    idToken,
    nonce,
  );
  return await auth.signInWithCredential(appleCredential);
};

export const authSignOut = async () => {
  await auth.signOut();
};

export const authWithdraw = async () => {
  await auth.currentUser?.delete();
};

export type { FirebaseAuthTypes } from "@react-native-firebase/auth";
