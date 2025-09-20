---
allowed-tools: mcp__github__get_pull_request_review_comments, mcp__github__reply_to_fixed_commit_in_pull_request_review_thread, mcp__github__reply_to_fixed_commit_in_pull_request_review_thread_batch, Read, Edit
description: 現在のブランチのPRのPRのレビューコメントを確認して修正し、コミット・pushして返信する
---

# Fix PR Comment

PRのレビューコメントを確認して修正し、コミット・pushして返信するコマンド

## 使用方法

```text
/fix-pr-comment
```

## 実行内容

1. 現在のブランチ名を確認
1. `mcp__github__get_pull_request_review_comments` でPRレビューコメントを取得
1. 指摘された問題をファイル単位で特定・分析する
1. ファイル単位で修正を実施する
1. 個別の修正内容をコミット（各ファイルごと）
1. 全修正完了後にlintチェックを実行
1. `pnpm fmt` でlintエラーを自動修正
1. testを実行してテストが通ることを確認
1. lint/testエラーがある場合は追加修正してコミット
1. 全ての修正をpush
1. 各レビューコメントのthread IDに対して
   `mcp__github__reply_to_fixed_commit_in_pull_request_review_thread_batch`
   で修正完了の返信を投稿
   - パラメーター: `replies` 配列（複数のスレッドにまとめて返信可能）

## 前提条件

- GitHub MCPが設定済みであること
- 対象ブランチのPRが存在すること
- 適切なGitHub権限があること

## 注意事項

- lintエラーは `pnpm fmt` で自動修正する
- コミットメッセージは日本語で作成される
- batch toolを使用することで、複数のレビューコメントへの返信を一度に効率的に処理する
- 各レビューコメントの返信には、そのコメントで指摘された問題を修正したコミットのハッシュを使用する
