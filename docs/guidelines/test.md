# テストガイドライン

このドキュメントでは、プロジェクトで使用するテストの書き方について説明します。

## テストの基本方針

### AAA形式（Arrange-Act-Assert）

すべてのテストは**AAA形式**で記述することを推奨します。この形式により、テストの意図が明確になり、保守性が向上します。

```typescript
describe("Component", () => {
  it("should perform expected behavior", () => {
    // Arrange - テストのセットアップ
    const expectedValue = "test value";
    const mockData = { id: 1, name: "test" };

    // Act - テスト対象の実行
    render(<Component data={mockData} />);
    fireEvent.press(screen.getByText("Button"));

    // Assert - 結果の検証
    expect(screen.getByText(expectedValue)).toBeOnTheScreen();
  });
});
```

#### 各フェーズの説明

- **Arrange（準備）**: テストに必要なデータ、モック、設定を準備する
- **Act（実行）**: テスト対象の処理を実行する
- **Assert（検証）**: 期待される結果が得られているかを確認する

## テストの構造化

### describe ブロックの階層化

関連するテストケースは `describe` ブロックでグループ化し、機能ごとに整理します。

```typescript
describe("LicenseComponent", () => {
  describe("Component Rendering", () => {
    it("should render header and statistics", () => {
      // テストケース
    });
  });

  describe("Search Functionality", () => {
    describe("Package Name Search", () => {
      it("should filter by package name", () => {
        // テストケース
      });
    });

    describe("License Type Search", () => {
      it("should filter by license type", () => {
        // テストケース
      });
    });
  });
});
```

### テストケース名の命名規則

テストケース名は以下の形式で記述します：

```typescript
it("should [期待される動作] when [条件]", () => {
  // テストケース
});

// 例：
it("should display filtered results when search term is entered", () => {
  // テストケース
});

it("should show all items when search is cleared", () => {
  // テストケース
});
```

## モックの使用

### データの一貫性を保つためのモック

テスト結果が一定になるよう、外部データはモック化します。

```typescript
// Mock data for consistent testing
const mockLicenses: LicenseInfo[] = [
  {
    name: "react",
    version: "18.0.0",
    license: "MIT",
    repository: "https://github.com/facebook/react",
    publisher: "React Team",
    url: "https://reactjs.org",
  },
  // ... more mock data
];

// Mock the external data source
jest.mock("./licenses.json", () => mockLicenses);
```

### モックのベストプラクティス

1. **予測可能なデータ**: テスト用のモックデータは予測可能で一貫性のあるものにする
2. **最小限のデータ**: テストに必要な最小限のフィールドのみを含める
3. **エッジケースの考慮**: 配列、null、undefined などのエッジケースも考慮する

## 実装例

### ライセンス画面のテスト実装例

以下は、ライセンス画面の包括的なテスト実装例です：

```typescript
import { composeStories } from "@storybook/react-native-web-vite";
import { fireEvent, render, screen } from "@/libs/test/testing-library";
import { License } from "./index";
import * as stories from "./index.stories";
import type { LicenseInfo } from "./types";

const { Default } = composeStories(stories);

// Mock data for consistent testing
const mockLicenses: LicenseInfo[] = [
  {
    name: "react",
    version: "18.0.0",
    license: "MIT",
    repository: "https://github.com/facebook/react",
    publisher: "React Team",
    url: "https://reactjs.org",
  },
  {
    name: "typescript",
    version: "5.0.0",
    license: "Apache-2.0",
    repository: "https://github.com/microsoft/TypeScript",
    publisher: "Microsoft Corp.",
    url: "https://www.typescriptlang.org",
  },
];

jest.mock("./licenses.json", () => mockLicenses);

describe("License", () => {
  describe("Component Rendering", () => {
    it("should render license screen with header and statistics", () => {
      // Arrange
      const expectedTitle = "オープンソースライセンス";
      const expectedDescription = "このアプリで使用されているオープンソースソフトウェアのライセンス一覧です。";

      // Act
      render(<License />);

      // Assert
      expect(screen.getByText(expectedTitle)).toBeOnTheScreen();
      expect(screen.getByText(expectedDescription)).toBeOnTheScreen();
      expect(screen.getByText("統計情報")).toBeOnTheScreen();
      expect(screen.getByText("ライセンス一覧")).toBeOnTheScreen();
      expect(screen.getByText(`総パッケージ数: ${mockLicenses.length}`)).toBeOnTheScreen();
    });
  });

  describe("Top 5 License Types Display", () => {
    it("should display top 5 license types with counts", () => {
      // Arrange
      const expectedMITCount = mockLicenses.filter(license => license.license === "MIT").length;
      const expectedApacheCount = mockLicenses.filter(license => license.license === "Apache-2.0").length;

      // Act
      render(<License />);

      // Assert
      expect(screen.getByText(`MIT: ${expectedMITCount}`)).toBeOnTheScreen();
      expect(screen.getByText(`Apache-2.0: ${expectedApacheCount}`)).toBeOnTheScreen();
    });
  });

  describe("Search Functionality", () => {
    describe("Package Name Search", () => {
      it("should filter licenses by package name when typing in search bar", () => {
        // Arrange
        const searchTerm = "react";
        const expectedPackage = mockLicenses.find(license =>
          license.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Act
        render(<License />);
        const searchInput = screen.getByPlaceholderText("パッケージ名、ライセンス、作成者で検索...");
        fireEvent.changeText(searchInput, searchTerm);

        // Assert
        if (expectedPackage) {
          expect(screen.getByText(expectedPackage.name)).toBeOnTheScreen();
        }
      });
    });

    describe("License Type Search", () => {
      it("should filter licenses by license type when typing in search bar", () => {
        // Arrange
        const searchTerm = "MIT";
        const expectedLicenses = mockLicenses.filter(license =>
          license.license.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Act
        render(<License />);
        const searchInput = screen.getByPlaceholderText("パッケージ名、ライセンス、作成者で検索...");
        fireEvent.changeText(searchInput, searchTerm);

        // Assert
        expectedLicenses.forEach(license => {
          expect(screen.getByText(license.name)).toBeOnTheScreen();
        });
      });
    });

    describe("Publisher Search", () => {
      it("should filter licenses by publisher when typing in search bar", () => {
        // Arrange
        const searchTerm = "Microsoft";
        const expectedPackage = mockLicenses.find(license =>
          license.publisher?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Act
        render(<License />);
        const searchInput = screen.getByPlaceholderText("パッケージ名、ライセンス、作成者で検索...");
        fireEvent.changeText(searchInput, searchTerm);

        // Assert
        if (expectedPackage) {
          expect(screen.getByText(expectedPackage.name)).toBeOnTheScreen();
        }
      });
    });
  });
});
```

## テストのベストプラクティス

### 1. 独立性の確保

各テストケースは他のテストに依存せず、独立して実行できるようにします。

### 2. 明確な期待値

テストで検証する内容は明確で具体的にします。

```typescript
// 良い例
expect(screen.getByText("MIT: 5")).toBeOnTheScreen();

// 悪い例
expect(screen.getByText(/MIT/)).toBeOnTheScreen();
```

### 3. エッジケースのテスト

通常のケースだけでなく、エラーケースや境界値もテストします。

```typescript
it("should handle empty search results", () => {
  // Arrange
  const searchTerm = "nonexistent-package";

  // Act
  render(<License />);
  const searchInput = screen.getByPlaceholderText("パッケージ名、ライセンス、作成者で検索...");
  fireEvent.changeText(searchInput, searchTerm);

  // Assert
  expect(screen.getByText("総パッケージ数: 0")).toBeOnTheScreen();
});
```

### 4. テストの保守性

テストコードも本体のコードと同様に保守性を考慮し、重複を避け、再利用可能なヘルパー関数を作成します。

```typescript
// ヘルパー関数の例
const searchForTerm = (searchTerm: string) => {
  const searchInput = screen.getByPlaceholderText("パッケージ名、ライセンス、作成者で検索...");
  fireEvent.changeText(searchInput, searchTerm);
};

const expectPackageToBeVisible = (packageName: string) => {
  expect(screen.getByText(packageName)).toBeOnTheScreen();
};
```

## まとめ

- すべてのテストはAAA形式で記述する
- 機能ごとに `describe` ブロックで整理する
- 外部データはモック化して一貫性を保つ
- 明確で具体的な期待値を設定する
- エッジケースも含めて包括的にテストする
- テストコードの保守性も考慮する

このガイドラインに従うことで、読みやすく保守性の高いテストコードを作成できます。