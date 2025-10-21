import { getContext } from "@getcronit/pylon";
import { vi } from "vitest";

/**
 * テスト環境で認証をモックするためのヘルパー関数
 */
export function mockAuthContext(options?: {
  userId?: string;
  testKey?: string;
  nodeEnv?: string;
}) {
  const userId = options?.userId || "test-user";
  const testKey = options?.testKey || "test-key";
  const nodeEnv = options?.nodeEnv || "test";

  // getContextをモック
  vi.mocked(getContext).mockReturnValue({
    req: {
      header: (name: string) => {
        if (name === "X-Test-User-Id") return userId;
        if (name === "X-Test-Key") return testKey;
        return undefined;
      },
    } as any,
    env: {
      NODE_ENV: nodeEnv,
      TEST_AUTH_KEY: testKey,
      CLERK_SECRET_KEY: "test-clerk-key",
      SECRET_KEY: "test-secret",
      TURSO_DATABASE_URL: "test-url",
      TURSO_AUTH_TOKEN: "test-token",
    },
    set: vi.fn(),
  } as any);
}

/**
 * 認証モックをクリア
 */
export function clearAuthMock() {
  vi.restoreAllMocks();
}
