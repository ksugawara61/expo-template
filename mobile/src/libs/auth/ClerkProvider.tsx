import { ClerkProvider as ClerkProviderOriginal } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
import type { FC, PropsWithChildren } from "react";

/**
 * Clerk Provider の抽象化レイヤー
 * 環境変数が設定されていない場合はダミーのProviderを返す
 */
export const ClerkProvider: FC<PropsWithChildren> = ({ children }) => {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // 環境変数が設定されていない場合は、Providerなしで子要素をそのまま返す
  if (!publishableKey) {
    console.warn(
      "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Clerk authentication will not be available.",
    );
    return <>{children}</>;
  }

  return (
    <ClerkProviderOriginal
      publishableKey={publishableKey}
      tokenCache={undefined}
    >
      {children}
    </ClerkProviderOriginal>
  );
};
