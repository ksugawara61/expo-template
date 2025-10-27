import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-expo";
import type { ReactNode } from "react";

interface ClerkProviderProps {
  children: ReactNode;
}

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const ClerkProvider = ({ children }: ClerkProviderProps) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
  }

  return (
    <BaseClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </BaseClerkProvider>
  );
};
