# Expo Template

このリポジトリは、Expo/React Nativeアプリケーションと GraphQL API サーバーで構成される monorepo プロジェクトテンプレートです。

## プロジェクト構成

このリポジトリは以下のワークスペースから構成されています：

- **mobile/** - Expo/React Native モバイルアプリケーション
- **graphql/** - GraphQL API サーバー（Pylon.js + Cloudflare Workers）
- **packages/** - 共有パッケージ

## 必要な環境

- Node.js（バージョンは `.node-version` を参照）
- pnpm 10.17.0 以上

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm start
```

## 主要な開発コマンド

### プロジェクト全体

```bash
# すべてのワークスペースでリンティング
pnpm lint

# すべてのワークスペースでコードフォーマット
pnpm fmt

# すべてのワークスペースで型チェック
pnpm typecheck

# すべてのワークスペースでテスト実行
pnpm test

# 変更されたファイルのみテスト
pnpm test:changed

# GraphQLコード生成
pnpm codegen

# 文章校正（Markdown）
pnpm lint:text
```

### Mobile（Expo/React Native）

```bash
cd mobile

# 開発サーバー起動
pnpm start

# プラットフォーム別起動
pnpm android  # Android
pnpm ios      # iOS
pnpm web      # Web

# テスト
pnpm test
pnpm test:watch

# Storybook
pnpm storybook        # 起動（ポート 6006）
pnpm storybook:build  # ビルド

# ビジュアルリグレッションテスト（VRT）
pnpm vrt          # VRT実行
pnpm vrt:report   # VRT実行とレポート表示
pnpm vrt:approve  # VRT結果を承認

# GraphQL
pnpm codegen      # 型定義とMSWモックの生成
```

### GraphQL API

```bash
cd graphql

# 開発サーバー起動
pnpm start

# ビルド
pnpm build

# デプロイ
pnpm deploy

# テスト
pnpm test
pnpm test:watch

# データベース
pnpm db:local   # ローカルDB起動
pnpm db:push    # スキーマをDBにプッシュ
pnpm db:studio  # Drizzle Studio起動
```

## 技術スタック

### Mobile

- **フレームワーク**: Expo / React Native
- **ルーティング**: Expo Router（ファイルベース）
- **GraphQL クライアント**: urql + gql.tada
- **UI ライブラリ**: React Native Paper
- **フォーム管理**: React Hook Form + Zod
- **テスト**: Jest + @testing-library/react-native
- **UI開発**: Storybook
- **VRT**: Storycap + reg-cli
- **モック**: MSW（Mock Service Worker）
- **リンティング/フォーマット**: ESLint + Biome

### GraphQL API

- **フレームワーク**: Pylon.js
- **デプロイ先**: Cloudflare Workers
- **ORM**: Drizzle ORM
- **データベース**: Turso（LibSQL）
- **テスト**: Vitest
- **モック**: MSW + openapi-msw
- **リンティング/フォーマット**: ESLint + Biome

### 開発ツール

- **パッケージマネージャー**: pnpm（workspace）
- **ビルドシステム**: Turbo
- **Gitフック**: lefthook
- **文章校正**: textlint

## 開発ガイド

詳細な開発ガイドは [CLAUDE.md](./CLAUDE.md) を参照してください。

## プロジェクト構造

```
.
├── mobile/              # Expo/React Nativeアプリケーション
│   ├── src/
│   │   ├── app/        # Expo Routerのルート定義
│   │   ├── components/ # 共通UIコンポーネント
│   │   ├── features/   # フィーチャーモジュール
│   │   └── libs/       # ユーティリティとライブラリ
│   └── package.json
├── graphql/            # GraphQL APIサーバー
│   ├── src/
│   │   ├── generated/  # 生成されたコード
│   │   └── ...
│   └── package.json
├── packages/           # 共有パッケージ
│   └── eslint-config/
├── CLAUDE.md           # Claude Code向けの詳細ガイド
└── package.json
```
