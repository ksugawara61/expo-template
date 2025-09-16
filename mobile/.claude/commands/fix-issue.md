---
allowed-tools: Bash, Read, Edit, MultiEdit, Glob, Grep, TodoWrite, TodoRead
description: GitHub issueを確認して修正PRを作成する
---

# GitHub Issue修正とPR作成

指定されたGitHub issueの内容を確認し、問題を修正してPRを作成します。

## 実行手順

1. **現在の環境の最新化**
   - `git switch main` で main ブランチに切り替える
   - `git pull origin main` で main ブランチを最新化

2. **Issue内容の確認**
   - `gh issue view {issue_number}` でissueの詳細を確認
   - 問題の内容を理解して修正方針を決定

3. **問題の調査と修正**
   - 関連ファイルを特定して問題箇所を調査
   - 適切な修正を実装
   - 型チェックや必要なテストを実行

4. **PR作成**
   - 修正内容をコミット
   - 新しいブランチを作成してプッシュ
   - PRを作成してissueに紐づけ

## 使用方法

```bash
/fix-issue 4
```

## 引数

- `$ARGUMENTS`: 修正対象のGitHub issue番号

## 実行される処理

1. TodoWriteでタスクリストを作成
2. `gh issue view` でissue詳細を確認
3. 関連ファイルの調査（Glob, Grep, Readツールを使用）
4. 問題の修正（Edit, MultiEditツールを使用）
5. 型チェックなど必要な検証を実行
6. git操作で`git checkout -b feature/$ARGUMENTS-機能名`でブランチ作成
7. git操作でコミット・プッシュ
8. MCPでPR作成とissue紐づけ（**PR本文は日本語で作成**）

## PR作成時の注意事項

- **PR本文は必ず日本語で作成してください**
- PRは `mcp__github__create_pull_request` を利用して作成してください

## 注意事項

- GitHub CLIがセットアップされている必要があります
- 適切な権限でGitHubリポジトリにアクセスできる必要があります
- 作業前にブランチが最新状態であることを確認してください
