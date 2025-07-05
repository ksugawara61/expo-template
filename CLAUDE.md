# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

### 基本的な開発コマンド

- `pnpm start` - Expo開発サーバーを起動
- `pnpm android` - Android用にプロジェクトを起動
- `pnpm ios` - iOS用にプロジェクトを起動
- `pnpm web` - Web用にプロジェクトを起動

### テストとCI/CD

- `pnpm test` - Jestを使用してテストを実行
- `pnpm test:watch` - ウォッチモードでテストを実行
- `pnpm lint` - Biomeを使用してコードをチェック
- `pnpm fmt` - Biomeを使用してコードをフォーマット
- `pnpm typecheck` - TypeScriptの型チェックを実行（ビルドはしない）

### Storybook

- `pnpm storybook` - Storybookを開発モードで起動（ポート6006）
- `pnpm storybook:build` - Storybookをビルド

### ビジュアルリグレッションテスト（VRT）

- `pnpm vrt` - VRTのキャプチャを実行し、比較レポートを生成
- `pnpm vrt:report` - VRTを実行してレポートを自動で開く
- `pnpm vrt:approve` - VRTの結果を承認（expected画像を更新）

## プロジェクト構造

### アーキテクチャ

このプロジェクトは**Expo Router**を使用したReact Native/Expoアプリケーションです。主要な特徴：

- **Expo Router** - ファイルベースのルーティングシステム
- **NativeWind** - TailwindCSSをReact Nativeで使用するためのライブラリ
- **Biome** - TypeScriptファイルのリンティングとフォーマッティング
- **Jest** - テストフレームワーク
- **Storybook** - UIコンポーネントのドキュメント・テスト環境
- **VRT（Visual Regression Testing）** - reg-cliとStorycapを使用したビジュアルテスト

### ディレクトリ構造

```
app/                    # Expo Routerのルートディレクトリ
  (tabs)/              # タブレイアウト
    _layout.tsx        # タブレイアウトの設定
    index.tsx          # ホーム画面
  _layout.tsx          # ルートレイアウト
src/                   # 共通コンポーネント・ユーティリティ
  ui/                  # UIコンポーネント
    Input.tsx          # 入力フィールドコンポーネント
    Input.stories.tsx  # Storybookストーリー
    Input.test.tsx     # テストファイル
  components/          # コンポーネントカタログ
    ActivityIndicator/       # ローディングインジケーター
      index.tsx              # コンポーネント本体
      index.stories.tsx      # Storybookストーリー
    Button/                  # ボタンコンポーネント
      index.tsx              # コンポーネント本体
      index.stories.tsx      # Storybookストーリー
    Card/                    # カードレイアウト
      index.tsx              # コンポーネント本体
      index.stories.tsx      # Storybookストーリー
    Badge/                   # バッジコンポーネント
      index.tsx              # コンポーネント本体
      index.stories.tsx      # Storybookストーリー
    index.ts                 # エクスポート設定
assets/                # 画像・フォントなどのリソース
vrt/                   # VRTの結果・設定
```

### 設定ファイル

- `app.json` - Expoの設定
- `tsconfig.json` - TypeScript設定（@/\*パスエイリアス設定済み）
- `biome.json` - Biomeの詳細なルール設定
- `jest.config.js` - Jestの設定
- `.textlintrc.json` - textlintの設定（日本語文章の校正用）

### スタイリング

- **NativeWind** - TailwindCSSクラスをReact Nativeで使用
- `global.css` - グローバルスタイル
- `tailwind.config.js` - Tailwindの設定

### テスト戦略

- **単体テスト** - Jest + @testing-library/react-native
- **ストーリーテスト** - Storybook
- **VRT** - Storycap + reg-cli で自動スクリーンショット比較
- **文章校正** - textlint（日本語技術文書の設定）

## 重要な開発ポイント

### パス解決

- `@/*` -> `./src/*` のパスエイリアスが設定済み
- コンポーネントのインポート時は `@/ui/Input` のような形式を使用
- コンポーネントカタログは `@/components` からインポート

### コンポーネントカタログ

`src/components` にReact Native Paper風のコンポーネントを実装済み：

- **ActivityIndicator** - ローディングインジケーター（サイズ・色・表示状態をカスタマイズ可能）
- **Button** - ボタンコンポーネント（default, destructive, outline, secondary, ghost バリエーション）
- **Card** - カードレイアウト（Header, Content, Footer で構成）
- **Badge** - バッジコンポーネント（default, secondary, destructive, outline バリエーション）

#### コンポーネント設計原則

- **型定義**: `type` を使用（`interface` ではなく）
- **children型**: `FC<PropsWithChildren<Type>>` を使用（`ReactNode` の直接指定は避ける）
- **スタイリング**: NativeWind で直接 className を記述（cn() 関数は不使用）
  - `className={`base-classes ${variant} ${size} ${conditional ? "class" : ""} ${className || ""}`}` パターンを使用
  - テンプレートリテラルで動的にクラスを組み合わせ
- **Storybook**: 各コンポーネントに複数のストーリーを用意
- **エクスポート**: `src/components/index.ts` で統一管理

#### コンポーネント実装ガイド

##### 基本構造

```typescript
import type { FC, PropsWithChildren } from "react";
import { View, Text } from "react-native";

// children を使わないコンポーネントの場合
export type ComponentProps = {
  variant?: "default" | "secondary";
  className?: string;
};

export const Component: FC<ComponentProps> = ({ variant = "default", className }) => {
  return (
    <View className={`base-classes ${variants[variant]} ${className || ""}`}>
      {/* content */}
    </View>
  );
};

// children を使うコンポーネントの場合
export type ContainerProps = {
  variant?: "default" | "secondary";
  className?: string;
};

export const Container: FC<PropsWithChildren<ContainerProps>> = ({ 
  children, 
  variant = "default", 
  className 
}) => {
  return (
    <View className={`base-classes ${variants[variant]} ${className || ""}`}>
      {children}
    </View>
  );
};
```

##### Storybookストーリー構造

```typescript
import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { Component } from "./Component";

const meta = {
  component: Component,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: "flex-start", padding: 20 }}>
        <Story />
      </View>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Component>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variant: Story = {
  args: {
    variant: "secondary",
  },
};
```

##### バリエーションパターン実装

```typescript
const variants = {
  default: "bg-slate-900 text-slate-50",
  secondary: "bg-slate-100 text-slate-900",
  destructive: "bg-red-500 text-white",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 py-1",
  lg: "h-12 px-8 py-3",
};

// 使用例
className={`rounded-md ${variants[variant]} ${sizes[size]} ${className || ""}`}
```

#### コンポーネント追加手順

1. **ディレクトリ作成**: `src/components/ComponentName/` ディレクトリを作成
2. **コンポーネントファイル作成**: `src/components/ComponentName/index.tsx`
3. **型定義**: `type` で Props を定義（children使用時は `FC<PropsWithChildren<Type>>`）
4. **バリエーション定義**: オブジェクトでバリエーション用のクラス群を定義
5. **スタイリング**: テンプレートリテラルで NativeWind クラスを組み合わせ
6. **Storybookストーリー作成**: `src/components/ComponentName/index.stories.tsx`
7. **エクスポート追加**: `src/components/index.ts` に追加
8. **フォーマット確認**: `pnpm fmt && pnpm lint` で確認

#### 参考実装

既存コンポーネントの実装パターンを参考にする場合：

- **ActivityIndicator**: children不要、条件付きレンダリング
- **Button**: children不要、複数バリエーション、ローディング状態
- **Card**: 複数子コンポーネント、階層構造
- **Badge**: children必要、シンプルなバリエーション

### VRTワークフロー

1. `pnpm vrt` でテストを実行
2. diff画像を確認
3. 意図した変更であれば `pnpm vrt:approve` で承認
4. `./vrt/public/report/index.html` でレポートを確認可能

### textlint設定

- 日本語技術文書向けのプリセット設定
- AI文章校正ルールも含む
- `@textlint-ja/preset-ai-writing` と `preset-ja-technical-writing` を使用
