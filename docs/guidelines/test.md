# テストガイドライン

このドキュメントでは、プロジェクト内でのテスト実装における規約とベストプラクティスを定義します。一貫性のあるテストコードを維持し、品質の高いソフトウェアを開発するために、以下のガイドラインに従ってください。

## テストフレームワーク

### Vitestを使用する

テストフレームワークには`vitest`を使用してください。

```typescript
// ✅ 推奨: vitest を使用
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('UserService', () => {
  it('should create a user successfully', () => {
    // テスト実装
  });
});
```

**理由**: VitestはViteとの統合が優れており、高速で現代的なテスト環境を提供します。

## テスト構造

### AAA（Arrange-Act-Assert）パターンを使用する

テストは明確に3つのセクションに分けてください。

```typescript
// ✅ 推奨: AAA パターン
describe('calculateTotalPrice', () => {
  it('should calculate total price with tax', () => {
    // Arrange: テストデータの準備
    const items = [
      { price: 100, quantity: 2 },
      { price: 200, quantity: 1 },
    ];
    const taxRate = 0.1;

    // Act: テスト対象の実行
    const result = calculateTotalPrice(items, taxRate);

    // Assert: 結果の検証
    expect(result).toBe(440); // (100*2 + 200*1) * 1.1
  });
});
```

### テストケース名は日本語で明確に記述する

```typescript
// ✅ 推奨: 明確な日本語のテスト名
describe('UserValidator', () => {
  it('有効なメールアドレスの場合はtrueを返す', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('無効なメールアドレスの場合はfalseを返す', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('空文字の場合はfalseを返す', () => {
    expect(validateEmail('')).toBe(false);
  });
});

// ❌ 非推奨: 曖昧なテスト名
describe('UserValidator', () => {
  it('should validate email', () => {
    // 何をテストしているか不明確
  });

  it('test email validation', () => {
    // 期待する結果が不明確
  });
});
```

## MCPツールのテスト

### ツールのテストパターン

MCPツールのテストでは、以下のパターンに従ってください。

```typescript
// ✅ 推奨: MCPツールの包括的テスト
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUserTool } from '../tools/createUser.js';
import * as userService from '../services/userService.js';

// サービスのモック化
vi.mock('../services/userService.js');

describe('createUserTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('有効なパラメータでユーザーを作成する', async () => {
      // Arrange
      const mockUser = { id: 'user-1', name: 'テストユーザー', email: 'test@example.com' };
      vi.mocked(userService.createUser).mockResolvedValue(mockUser);

      // Act
      const result = await createUserTool.handler({
        name: 'テストユーザー',
        email: 'test@example.com',
      });

      // Assert
      expect(result.content[0].text).toContain('ユーザーが作成されました');
      expect(result.isError).toBeUndefined();
      expect(userService.createUser).toHaveBeenCalledWith({
        name: 'テストユーザー',
        email: 'test@example.com',
      });
    });
  });

  describe('異常系', () => {
    it('必須パラメータが不足している場合はエラーを返す', async () => {
      // Act
      const result = await createUserTool.handler({
        name: '', // 空文字
        email: 'test@example.com',
      });

      // Assert
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('エラー');
    });

    it('サービスエラー時は適切なエラーメッセージを返す', async () => {
      // Arrange
      vi.mocked(userService.createUser).mockRejectedValue(
        new Error('データベース接続エラー')
      );

      // Act
      const result = await createUserTool.handler({
        name: 'テストユーザー',
        email: 'test@example.com',
      });

      // Assert
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('データベース接続エラー');
    });
  });
});
```

## モック戦略

### 外部依存関係のモック化

外部API、データベース、ファイルシステムなどの依存関係は必ずモック化してください。

```typescript
// ✅ 推奨: 外部依存関係のモック化
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUserData } from '../services/apiService.js';
import { saveToDatabase } from '../services/dbService.js';

// 外部依存関係をモック化
vi.mock('../services/apiService.js');
vi.mock('../services/dbService.js');

describe('UserProcessor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('API からデータを取得してデータベースに保存する', async () => {
    // Arrange
    const mockApiData = { id: '1', name: 'テストユーザー' };
    vi.mocked(fetchUserData).mockResolvedValue(mockApiData);
    vi.mocked(saveToDatabase).mockResolvedValue(undefined);

    // Act
    await processUser('1');

    // Assert
    expect(fetchUserData).toHaveBeenCalledWith('1');
    expect(saveToDatabase).toHaveBeenCalledWith(mockApiData);
  });
});
```

### モック関数の型安全性

```typescript
// ✅ 推奨: 型安全なモック
import { vi } from 'vitest';
import type { UserService } from '../services/userService.js';

const mockUserService: UserService = {
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  findUser: vi.fn(),
};

// 型安全にモック関数を設定
mockUserService.createUser.mockResolvedValue({
  id: 'user-1',
  name: 'テストユーザー',
  email: 'test@example.com',
});
```

## データベーステスト

### インメモリデータベースの使用

データベースのテストにはインメモリデータベースを使用してください。

```typescript
// ✅ 推奨: インメモリデータベースを使用したテスト
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { users } from '../schema/users.js';

describe('UserRepository', () => {
  let db: ReturnType<typeof drizzle>;
  let sqlite: Database.Database;

  beforeEach(async () => {
    // インメモリデータベースを作成
    sqlite = new Database(':memory:');
    db = drizzle(sqlite);
    
    // マイグレーションを実行
    await migrate(db, { migrationsFolder: './drizzle' });
  });

  afterEach(() => {
    sqlite.close();
  });

  it('ユーザーを作成して取得できる', async () => {
    // Arrange
    const userData = {
      name: 'テストユーザー',
      email: 'test@example.com',
    };

    // Act
    const [createdUser] = await db.insert(users).values(userData).returning();
    const foundUser = await db.select().from(users).where(eq(users.id, createdUser.id));

    // Assert
    expect(foundUser[0]).toMatchObject(userData);
    expect(foundUser[0].id).toBeDefined();
    expect(foundUser[0].createdAt).toBeDefined();
  });
});
```

## 非同期処理のテスト

### async/awaitパターンの使用

非同期処理のテストでは、`async/await`を使用してください。

```typescript
// ✅ 推奨: async/await を使用
describe('AsyncService', () => {
  it('非同期処理が正常に完了する', async () => {
    // Arrange
    const expectedResult = { data: 'test' };
    vi.mocked(apiService.fetchData).mockResolvedValue(expectedResult);

    // Act
    const result = await processData('test-id');

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('非同期処理でエラーが発生した場合の処理', async () => {
    // Arrange
    const error = new Error('API Error');
    vi.mocked(apiService.fetchData).mockRejectedValue(error);

    // Act & Assert
    await expect(processData('test-id')).rejects.toThrow('API Error');
  });
});
```

### タイムアウトのテスト

```typescript
// ✅ 推奨: タイムアウト処理のテスト
describe('TimeoutService', () => {
  it('指定時間内に処理が完了しない場合はタイムアウトエラーを発生させる', async () => {
    // Arrange
    const slowPromise = new Promise(resolve => setTimeout(resolve, 2000));
    vi.mocked(slowService.process).mockReturnValue(slowPromise);

    // Act & Assert
    await expect(processWithTimeout('data', 1000)).rejects.toThrow('Timeout');
  }, 1500); // テスト自体のタイムアウトを設定
});
```

## エラーハンドリングのテスト

### 例外処理の検証

```typescript
// ✅ 推奨: 例外処理の適切なテスト
describe('ValidationService', () => {
  it('無効なデータの場合は適切なエラーメッセージを投げる', async () => {
    // Arrange
    const invalidData = { email: 'invalid-email' };

    // Act & Assert
    await expect(validateUser(invalidData)).rejects.toThrow('無効なメールアドレスです');
  });

  it('必須フィールドが不足している場合は適切なエラーを投げる', async () => {
    // Arrange
    const incompleteData = { email: 'test@example.com' }; // name が不足

    // Act & Assert
    await expect(validateUser(incompleteData)).rejects.toThrow(/name.*required/i);
  });
});
```

## テストデータの管理

### ファクトリー関数の使用

テストデータの生成にはファクトリー関数を使用してください。

```typescript
// ✅ 推奨: ファクトリー関数でテストデータを生成
// tests/factories/userFactory.ts
export const createTestUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-1',
  name: 'テストユーザー',
  email: 'test@example.com',
  role: 'user',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createTestAdmin = (overrides: Partial<User> = {}): User => 
  createTestUser({ role: 'admin', ...overrides });

// テストでの使用
describe('UserService', () => {
  it('管理者権限のチェック', () => {
    // Arrange
    const admin = createTestAdmin();
    const regularUser = createTestUser();

    // Act & Assert
    expect(hasAdminAccess(admin)).toBe(true);
    expect(hasAdminAccess(regularUser)).toBe(false);
  });
});
```

## パフォーマンステスト

### 実行時間の測定

```typescript
// ✅ 推奨: パフォーマンステスト
describe('PerformanceTest', () => {
  it('大量データの処理が規定時間内に完了する', async () => {
    // Arrange
    const largeDataSet = Array.from({ length: 10000 }, (_, i) => 
      createTestUser({ id: `user-${i}` })
    );

    // Act
    const startTime = performance.now();
    const result = await processUsers(largeDataSet);
    const endTime = performance.now();

    // Assert
    expect(result).toHaveLength(10000);
    expect(endTime - startTime).toBeLessThan(1000); // 1秒以内
  });
});
```

## カバレッジ

### カバレッジ設定

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/types/schema.ts', // 自動生成ファイル
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

## CI/CDでのテスト実行

### GitHub Actions設定例

```yaml
# ✅ 推奨: CI/CDでのテスト実行
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm type-check
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm test:coverage
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## テストの実行とデバッグ

### 開発時のテスト実行

```bash
# ✅ 推奨: 開発時のテストコマンド

# 全テスト実行
pnpm test

# ウォッチモードでテスト実行
pnpm test --watch

# 特定のテストファイルのみ実行
pnpm test userService.test.ts

# 特定のテストケースのみ実行
pnpm test --grep "ユーザーを作成"

# カバレッジ付きでテスト実行
pnpm test:coverage

# デバッグモードでテスト実行
pnpm test --inspect-brk
```

## まとめ

このガイドラインに従うことで、以下を実現できます：

- **信頼性**: 包括的なテストによる品質保証
- **保守性**: 理解しやすく変更しやすいテストコード
- **効率性**: 高速で安定したテスト実行
- **一貫性**: チーム全体で統一されたテスト手法
- **デバッグ性**: 問題の早期発見と原因特定

新しい機能を実装する際は、必ずテストも同時に作成し、このガイドラインに従って実装してください。テストは単なる品質保証ツールではなく、設計の改善と開発効率の向上に貢献する重要な要素です。
