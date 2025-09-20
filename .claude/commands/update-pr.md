---
allowed-tools: mcp__github_update_pull_request, Read, Edit
description: PR本文を最新の変更内容を確認して修正するコマンド
---

# Update PR

PR本文を最新の変更内容を確認して修正するコマンド

## 使用方法

```text
/update-pr
```

## 実行内容

1. 現在のブランチ名を確認
1. `gh pr view` コマンドで現在のブランチのPRの内容を確認
1. git コマンドで base ブランチと現在ブランチの変更内容の差分を確認
1. `mcp__github_update_pull_request` でPR本文を最新化する
   - パラメーター: `title`, `summary`, `testItems`, `additionalNotes`, `issueNumber`, `branchName`
