import { verifyToken } from "@clerk/backend";
import { getContext } from "@getcronit/pylon";

/**
 * Clerk認証ミドルウェア
 * リクエストのAuthorizationヘッダーからトークンを検証し、認証されたユーザー情報をコンテキストに設定する
 */
export async function verifyAuth() {
  const ctx = getContext();

  // Authorizationヘッダーからトークンを取得
  const authHeader = ctx.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No valid authorization header found");
  }

  const token = authHeader.replace("Bearer ", "");

  // Clerk Secret Keyを環境変数から取得
  const clerkSecretKey = ctx.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    throw new Error(
      "Server configuration error: CLERK_SECRET_KEY is not set",
    );
  }

  try {
    // JWTトークンを検証
    const payload = await verifyToken(token, {
      secretKey: clerkSecretKey,
    });

    if (!payload.sub) {
      throw new Error("Unauthorized: Invalid token");
    }

    // 認証されたユーザーIDをコンテキストに設定
    ctx.set("userId", payload.sub);

    return { userId: payload.sub };
  } catch (error) {
    throw new Error(
      `Unauthorized: ${error instanceof Error ? error.message : "Token verification failed"}`,
    );
  }
}

/**
 * 認証が必要なリゾルバーをラップするヘルパー関数
 */
export function requireAuth<T extends (...args: any[]) => any>(
  resolver: T,
): T {
  return (async (...args: Parameters<T>) => {
    await verifyAuth();
    return resolver(...args);
  }) as T;
}
