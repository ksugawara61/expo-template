import { atom } from "jotai";

export interface AuthState {
  userId: string | null;
  testKey: string | null;
  isLoggedIn: boolean;
  clerkToken: string | null;
}

// Base auth state atom
export const authStateAtom = atom<AuthState>({
  userId: null,
  testKey: null,
  isLoggedIn: false,
  clerkToken: null,
});

// Derived atoms for convenient access
export const isLoggedInAtom = atom((get) => get(authStateAtom).isLoggedIn);
export const userIdAtom = atom((get) => get(authStateAtom).userId);
export const clerkTokenAtom = atom((get) => get(authStateAtom).clerkToken);

// Write-only atom for updating auth state
export const updateAuthStateAtom = atom(
  null,
  (get, set, newState: Partial<AuthState>) => {
    const currentState = get(authStateAtom);
    set(authStateAtom, { ...currentState, ...newState });
  },
);

// Specific action atoms
export const loginAtom = atom(
  null,
  (get, set, params: { userId: string; testKey: string }) => {
    set(authStateAtom, {
      userId: params.userId,
      testKey: params.testKey,
      isLoggedIn: true,
      clerkToken: null,
    });
  },
);

export const clerkLoginAtom = atom(
  null,
  (get, set, params: { userId: string; clerkToken: string }) => {
    set(authStateAtom, {
      userId: params.userId,
      testKey: null,
      isLoggedIn: true,
      clerkToken: params.clerkToken,
    });
  },
);

export const logoutAtom = atom(null, (get, set) => {
  set(authStateAtom, {
    userId: null,
    testKey: null,
    isLoggedIn: false,
    clerkToken: null,
  });
});
