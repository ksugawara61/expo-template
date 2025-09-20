# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト構成

このリポジトリは以下のワークスペースから構成されています：

- `mobile/` - Expo/React Nativeアプリケーション
- `graphql/` - GraphQL API サーバー（Pylon.js使用）

## 開発コマンド

### Mobile (Expo/React Native)

#### 基本的な開発コマンド

- `cd mobile && pnpm start` - Expo開発サーバーを起動
- `cd mobile && pnpm android` - Android用にプロジェクトを起動
- `cd mobile && pnpm ios` - iOS用にプロジェクトを起動
- `cd mobile && pnpm web` - Web用にプロジェクトを起動

#### テストとCI/CD

- `cd mobile && pnpm test` - Jestを使用してテストを実行
- `cd mobile && pnpm test:watch` - ウォッチモードでテストを実行
- `cd mobile && pnpm lint` - BiomeとESLintを使用してコードをチェック
- `cd mobile && pnpm fmt` - BiomeとESLintを使用してコードをフォーマット
- `cd mobile && pnpm typecheck` - TypeScriptの型チェックを実行（ビルドはしない）

#### GraphQL

- `cd mobile && pnpm codegen` - GraphQLスキーマから型定義とMSWモックを生成
- `cd mobile && pnpm expo:fix` - Expoの依存関係を修正

#### Storybook

- `cd mobile && pnpm storybook` - Storybookを開発モードで起動（ポート6006）
- `cd mobile && pnpm storybook:build` - Storybookをビルド

#### ビジュアルリグレッションテスト（VRT）

- `cd mobile && pnpm vrt` - VRTのキャプチャを実行し、比較レポートを生成
- `cd mobile && pnpm vrt:report` - VRTを実行してレポートを自動で開く
- `cd mobile && pnpm vrt:approve` - VRTの結果を承認（expected画像を更新）

### GraphQL API

#### 基本的な開発コマンド

- `cd graphql && pnpm dev` - 開発サーバーを起動
- `cd graphql && pnpm build` - プロダクションビルドを実行
- `cd graphql && pnpm start` - プロダクションサーバーを起動

#### テストとCI/CD

- `cd graphql && pnpm test` - Vitestを使用してテストを実行
- `cd graphql && pnpm test:watch` - ウォッチモードでテストを実行
- `cd graphql && pnpm lint` - Biomeを使用してコードをチェック
- `cd graphql && pnpm fmt` - Biomeを使用してコードをフォーマット
- `cd graphql && pnpm typecheck` - TypeScriptの型チェックを実行

#### データベース

- `cd graphql && pnpm db:push` - Prismaスキーマをデータベースにプッシュ
- `cd graphql && pnpm db:seed` - データベースにシードデータを投入
- `cd graphql && pnpm db:studio` - Prisma Studioを起動

## プロジェクト構造

### Mobile (Expo/React Native)

**Expo Router**を使用したReact Native/Expoアプリケーション：

- **Expo Router** - ファイルベースのルーティングシステム
- **Apollo Client** - GraphQLクライアント（SWRと併用）
- **GraphQL Codegen** - 型安全なGraphQLクライアントコードとMSWモックの自動生成
- **ReactNativePaper** - スタイリングで使用するためのライブラリ
- **Biome + ESLint** - TypeScriptファイルのリンティングとフォーマッティング
- **Jest** - テストフレームワーク
- **Storybook** - UIコンポーネントのドキュメント・テスト環境
- **VRT（Visual Regression Testing）** - reg-cliとStorycapを使用したビジュアルテスト
- **MSW** - APIモックとテストデータ管理

### GraphQL API

**Pylon.js**を使用したGraphQL APIサーバー：

- **Pylon.js** - TypeScript-first GraphQLフレームワーク
- **Prisma** - データベースORM
- **Vitest** - テストフレームワーク
- **Biome** - リンティングとフォーマッティング

## 重要な開発ポイント

### 作業ディレクトリ

プロジェクトのルートディレクトリで作業することを推奨します。VSCodeの設定で各ワークスペースに対応しています。

### パス解決

#### Mobile

- `@/*` -> `./src/*` のパスエイリアスが設定済み
- コンポーネントカタログは `@/components` からインポート
- フィーチャーモジュールは `@/features` からインポート
- 共通ライブラリは `@/libs` からインポート

#### GraphQL

- 絶対パスでのインポートを使用

### テスト戦略

#### Mobile

- **単体テスト** - Jest + @testing-library/react-native
- **ストーリーテスト** - Storybook
- **VRT** - Storycap + reg-cli で自動スクリーンショット比較
- **文章校正** - textlint（日本語技術文書の設定）

#### GraphQL

- **単体テスト** - Vitest
- **統合テスト** - Prismaモックを使用したテスト
