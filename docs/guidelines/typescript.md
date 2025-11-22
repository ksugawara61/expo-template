# TypeScript ガイドライン

このドキュメントでは、プロジェクト内でのTypeScriptコーディング規約を定義します。一貫性のあるコードベースを維持し、開発効率を向上させるために、以下のガイドラインに従ってください。

## 関数定義

### アロー関数を使用する

関数定義には`function`キーワードではなく、アロー関数を使用してください。

```typescript
// ✅ 推奨: アロー関数
const getUserData = async (userId: string): Promise<User> => {
  return await userRepository.findById(userId);
};

const calculateSum = (a: number, b: number): number => a + b;

// ❌ 非推奨: function キーワード
function getUserData(userId: string): Promise<User> {
  return userRepository.findById(userId);
}

function calculateSum(a: number, b: number): number {
  return a + b;
}
```

**理由**: アロー関数は`this`のバインディングが明確で、より簡潔な記述が可能です。

## 型定義

### typeを使用する

型定義には`interface`ではなく`type`を使用してください。

```typescript
// ✅ 推奨: type を使用
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type UserCreateInput = {
  name: string;
  email: string;
};

// Union型や交差型も簡潔に記述可能
type Status = 'pending' | 'approved' | 'rejected';
type UserWithStatus = User & { status: Status };

// ❌ 非推奨: interface を使用
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface UserCreateInput {
  name: string;
  email: string;
}
```

**理由**: `type`はより柔軟で、Union型や交差型の表現が簡潔になります。また、一貫性を保つことができます。

## エクスポート

### Named Exportを使用する

モジュールのエクスポートには一貫してNamed Exportを使用してください。

```typescript
// ✅ 推奨: Named Export
export const userService = {
  createUser,
  updateUser,
  deleteUser,
};

export const UserRepository = {
  findById,
  findByEmail,
  save,
};

// ✅ 推奨: 複数のNamed Export
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// ❌ 非推奨: Default Export
export default {
  createUser,
  updateUser,
  deleteUser,
};

export default class UserRepository {
  // ...
}
```

**理由**: Named Exportは明示的で、IDEでの自動インポートやリファクタリングが確実に行えます。

## 関数型アプローチ

### map/reduce/filterを積極的に活用する

データ変換にはfor文よりもmap、reduce、filterなどの関数型メソッドを使用してください。

```typescript
// ✅ 推奨: 関数型アプローチ
const processUsers = (users: User[]): UserSummary[] => {
  return users
    .filter(user => user.isActive)
    .map(user => ({
      id: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      lastLoginDays: calculateDaysSince(user.lastLoginAt),
    }))
    .sort((a, b) => a.lastLoginDays - b.lastLoginDays);
};

const calculateTotalAmount = (orders: Order[]): number => {
  return orders.reduce((total, order) => total + order.amount, 0);
};

// ✅ 推奨: 複雑な変換もメソッドチェーンで
const groupUsersByRole = (users: User[]): Record<string, User[]> => {
  return users.reduce((acc, user) => {
    const role = user.role;
    acc[role] = acc[role] || [];
    acc[role].push(user);
    return acc;
  }, {} as Record<string, User[]>);
};

// ❌ 非推奨: 命令型アプローチ
const processUsers = (users: User[]): UserSummary[] => {
  const result: UserSummary[] = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.isActive) {
      result.push({
        id: user.id,
        displayName: `${user.firstName} ${user.lastName}`,
        lastLoginDays: calculateDaysSince(user.lastLoginAt),
      });
    }
  }
  return result;
};
```

**理由**: 関数型アプローチはより宣言的で、意図が明確になり、バグの発生を抑制できます。

## その他のガイドライン

### 型安全性を最優先する

`as`によるフォースキャストは可能な限り避け、型ガード関数を使用してください。

```typescript
// ✅ 推奨: 型ガード関数を使用
const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
};

const processUserData = (data: unknown): User | null => {
  if (isUser(data)) {
    return data; // 型安全にUserとして扱える
  }
  return null;
};

// ❌ 非推奨: as によるフォースキャスト
const processUserData = (data: unknown): User => {
  return data as User; // 危険: 実行時エラーの可能性
};
```

### 定数は適切にconst assertionsを使用する

```typescript
// ✅ 推奨: const assertions
const USER_ROLES = ['admin', 'user', 'guest'] as const;
type UserRole = typeof USER_ROLES[number]; // 'admin' | 'user' | 'guest'

const API_ENDPOINTS = {
  USERS: '/api/users',
  ORDERS: '/api/orders',
  PRODUCTS: '/api/products',
} as const;

// ❌ 非推奨: 通常の定数定義
const USER_ROLES = ['admin', 'user', 'guest']; // string[]型になってしまう
```

### Optionalパラメータは最後に配置する

```typescript
// ✅ 推奨: オプションパラメータは最後
const createUser = (
  name: string,
  email: string,
  role: UserRole = 'user'
): User => {
  // ...
};

const fetchUsers = (
  limit: number,
  offset?: number,
  sortBy?: string
): Promise<User[]> => {
  // ...
};

// ❌ 非推奨: オプションパラメータが中間にある
const createUser = (
  name: string,
  role: UserRole = 'user',
  email: string // オプションパラメータの後に必須パラメータ
): User => {
  // ...
};
```

### Utility Typesを積極的に活用する

```typescript
// ✅ 推奨: Utility Typesの活用
type UserCreateInput = Pick<User, 'name' | 'email'>;
type UserUpdateInput = Partial<Pick<User, 'name' | 'email' | 'role'>>;
type UserPublicInfo = Omit<User, 'password' | 'createdAt'>;

// ✅ 推奨: Record型で辞書構造を表現
type UserRolePermissions = Record<UserRole, string[]>;

// ❌ 非推奨: 重複した型定義
type UserCreateInput = {
  name: string;
  email: string;
};
```

## まとめ

これらのガイドラインに従うことで、以下の利点を得られます。

- 一貫性: チーム全体で統一されたコーディングスタイル
- 可読性: 意図が明確で理解しやすいコード
- 保守性: リファクタリングや機能追加が容易
- 型安全性: 実行時エラーの削減

ガイドラインに迷った場合は、既存のコードベースを参考にし、チームでの議論を通じて改善していきましょう。
