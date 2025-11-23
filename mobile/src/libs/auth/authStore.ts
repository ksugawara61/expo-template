import { createStore } from "jotai";

// グローバルなjotaiストアを作成
// このストアは認証状態を管理し、urqlClientなどからアクセス可能
let globalAuthStore: ReturnType<typeof createStore> | null = null;

/**
 * 認証用のjotaiストアを初期化する
 * アプリケーション起動時に一度だけ呼ばれる
 */
export const initAuthStore = () => {
  if (!globalAuthStore) {
    globalAuthStore = createStore();
  }
  return globalAuthStore;
};

/**
 * 認証用のjotaiストアを取得する
 * urqlClientのfetchOptionsなど、Reactコンポーネント外からアクセスする場合に使用
 */
export const getAuthStore = () => {
  if (!globalAuthStore) {
    // ストアが未初期化の場合は自動的に初期化
    return initAuthStore();
  }
  return globalAuthStore;
};

/**
 * テスト用にストアをリセットする
 * @internal
 */
export const resetAuthStore = () => {
  globalAuthStore = null;
};
