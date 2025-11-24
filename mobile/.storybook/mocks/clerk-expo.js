export const useSignIn = () => ({
  isLoaded: true,
  signIn: () => Promise.resolve(),
  setActive: () => Promise.resolve(),
});

export const useAuth = () => ({
  signOut: () => void 0,
});
