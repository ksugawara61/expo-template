---
allowed-tools: Bash, Read, Edit, MultiEdit, Glob, Grep, TodoWrite, TodoRead
description: GitHub issueを確認して修正PRを作成する
---

# GitHub Issue修正とPR作成

指定されたGitHub issueの内容を確認し、問題を修正してPRを作成します。

## 使用方法

```txt
/fix-issue 4
```

## 引数

- `$ARGUMENTS`: 修正対象のGitHub issue番号

## 実行手順

1. **現在の環境の最新化**
   - `git switch main` で main ブランチに切り替える
   - `git pull origin main` で main ブランチを最新化

2. **Issue内容の確認**
   - `gh issue view {issue_number}` でissueの詳細を確認
   - issueの  Why の記述からタスクを実施したい理由を確認
   - issueの Acceptance Criteria の記述からタスクの受け入れ条件を確認
   - issueの Note から補足事項を確認
     - 関連URLが存在する場合は `mcp__readability__read_url_content_as_markdown` でURLの内容を確認する

3. **問題の調査と修正**
   - issueの内容を基に修正方針を整理
   - 関連ファイルを特定して問題箇所を調査
   - 適切な修正を実装
   - 型チェックや必要なテストを実行

4. **PR作成**
   - `git checkout -b feature/$ARGUMENTS-機能名` 新しいブランチを作成
   - 修正内容をコミットしてプッシュ
   - `mcp__github__create_pull_request` を利用してPRを作成してissueに紐付け
     - PR本文は必ず日本語で作成してください

## 注意事項

- GitHub CLIがセットアップされている必要があります
- 適切な権限でGitHubリポジトリにアクセスできる必要があります
- 作業前にブランチが最新状態であることを確認してください
