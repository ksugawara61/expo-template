# urql Graphcache: キャッシュ更新ガイド

本ドキュメントは urql の Graphcache におけるキャッシュ更新 (Cache Updates) の公式ドキュメント
( https://nearform.com/open-source/urql/docs/graphcache/cache-updates/ ) を参考に、
実務で必要となる観点を整理したものです。Apollo など他実装からの移行時や、仕様検討・実装レビュー時の指針として利用してください。

## 目次

1. 基本概念と設計方針
2. Updater が必要となるケースの判断基準
3. Updater 関数のシグネチャと役割
4. エンティティの手動更新
5. リスト / リンク(リレーション) の更新パターン
6. 可変個数・未知ページ数への対応 (inspectFields)
7. 無効化 (Invalidation) による再取得戦略
8. 楽観的更新 (Optimistic Updates)
9. ベストプラクティス / アンチパターン
10. 代表的ユースケース別テンプレート
11. 参考 API 一覧

---

## 1. 基本概念と設計方針

Graphcache は正規化 (Normalized) キャッシュです。Query ルートから辿れるグラフをエンティティ単位に分解し、
`__typename` と ID (key) により一意化して保存します。Mutation / Subscription 結果も同様に正規化され、
同一エンティティが参照される全クエリへ反映されます。

しかし Mutation が「影響を与えるリンク(リレーション)」を十分に返さない場合、キャッシュは自動で更新できません。
このギャップを埋めるのが `updates` (Updater) です。Resolver は「読取時の動的計算」、Updater は
「書き込み後の副作用的なリンク操作」と整理すると理解しやすいです。

---

## 2. Updater が必要となるケースの判断基準

以下の Mutation / Subscription は Updater を検討します。

- 削除: `deleteXxx` → 既存リストから対象エンティティを除外する必要
- 作成: `createXxx` → リスト末尾/先頭への追加、または関連フィールドへリンク付与
- リンク変更: 例) `moveTaskToList` → 親/子の関連フィールドを書き換える
- ページングされた複数リストへ影響: どのページを保持しているかわからない
- Mutation が必要なフィールドを返さない (Scalar のみ返すなど)

逆に以下は Updater 不要 (スキーマ改善を優先)

- Mutation が更新対象エンティティ全体を返せる (Graphcache が自動反映)
- 単にフィールド値を更新するだけでリスト構造(リンク)に変化がない

Poor schema smell:

- 更新系 Mutation が対象エンティティを返さない (→ 返すように変更した方がよい)

---

## 3. Updater 関数のシグネチャと役割

`cacheExchange({ updates: { Mutation: { someField(result, args, cache, info) { ... } } } })`

- `result`: フィールドを含む完全な API 結果 (過度な依存は避けるが利用可)
- `args`: フィールド呼び出し引数 (未指定なら `{}`)
- `cache`: 読取/書込/リンク/検査/無効化 API
- `info`: Traversal 情報 (高度なケースでのみ使用推奨)
- 返り値: 無視 (副作用でキャッシュ操作)

Graphcache のキャッシュ更新 API (代表):

- 読取: `cache.readFragment`, `cache.resolve`, `cache.inspectFields`
- 書込: `cache.writeFragment`, `cache.updateQuery`, `cache.link`
- 無効化: `cache.invalidate`
- 補助: `cache.keyOfEntity`

制約: Updater / Resolver / Optimistic 以外の任意タイミングでは `cache` メソッド呼び出し不可 (Invalid Cache Call エラー)。

---

## 4. エンティティの手動更新

Mutation が必要フィールドを返さない場合 (例: scalar のみ) は `cache.writeFragment` を利用。

```ts
const fragment = gql`
  fragment _ on Todo { id updatedAt }
`;
cache.writeFragment(fragment, { id: args.id, updatedAt: args.date });
```

スキーマを改善してエンティティを返せるならそれが優先。

---

## 5. リスト / リンク(リレーション) の更新パターン

### 5.1 固定クエリへの追加 (作成系)

`cache.updateQuery({ query: ListDoc }, data => ({ ...data, items: [...data.items, result.createItem] }))`

### 5.2 link の直接操作

`cache.link(entityKeyOrType, fieldName, nextEntityKey | [keys])`

- 既存配列を `cache.resolve` で取得し、配列再構築して `cache.link` で書き戻し
- scalar 変更は `writeFragment` / `updateQuery` を使用

### 5.3 削除

フィルタリング: `data.items = data.items.filter(x => x.id !== args.id)`

---

## 6. 可変個数・未知ページ数への対応 (inspectFields)

ページングや不特定多数の引数バリエーションを持つリストの更新時:

```ts
cache.inspectFields('Query')
  .filter(f => f.fieldName === 'todos')
  .forEach(f => {
    cache.updateQuery({ query: PaginatedDoc, variables: { skip: f.arguments.skip } }, data => {
      if (!data) return data;
      data.todos = data.todos.filter(t => t.id !== args.id);
      return data;
    });
  });
```

`inspectFields` は `fieldName`, `arguments`, `fieldKey` を提供。

---

## 7. 無効化 (Invalidation) による再取得戦略

複雑で正確な Updater が難しい場合は `cache.invalidate` を利用し再フェッチを誘発。

- エンティティ単位: `cache.invalidate({ __typename: 'Todo', id })`
- フィールド単位: `cache.invalidate('Query', 'todos', { skip: 0 })`
- 型全体: `cache.invalidate('Todo')`
一覧をソート変更する可能性など正確な差分更新が難しい場合に有効。

---

## 8. 楽観的更新 (Optimistic Updates)

`cacheExchange({ optimistic: { favoriteTodo(args, cache, info) { return { __typename: 'Todo', id: args.id, favorite: true }; } } })`

特性:

- Optimistic 結果は本物の結果到着時にロールバック → 実結果適用
- 依存 Query は即時反映 (UX 向上) ただし未キャッシュ部分が必要なら表示されないことも
- `info.variables` で GraphQL ドキュメントに未定義の追加変数を参照可 (API 送信時には除外)
- 引数付きフィールドへの楽観的更新はフィールドに関数を生やす (`favorite(args2){}`)

注意:

- 過度な楽観的更新は失敗時ロールバック/エラー UI の複雑化を招く
- 失敗頻度の高い操作は悲観的 (結果待ち) にする判断も

---

## 9. ベストプラクティス / アンチパターン

| 項目 | 推奨 | 非推奨 / 注意 |
|------|------|----------------|
| スキーマ設計 | 変更対象エンティティを Mutation の戻り値に含める | scalar のみ返して Updater 乱立 |
| 削除 / 作成 | link 変更に集中 (`cache.link` か list 再構築) | 全 Query を無効化し過剰 refetch |
| ページング | `inspectFields` で動的対象列挙 | キャッシュに保持されているページを暗黙に仮定 |
| 楽観的更新 | 成功率高く小さな副作用の操作 | 失敗頻度高い/複雑なトランザクション |
| 更新粒度 | 必要最小限の invalidation | 無差別に型全体無効化 |
| テスト | Updater: list 変化, delete, pagination, optimistic rollback | 手動操作を UI 経由でのみ確認 |

---

## 10. 代表的ユースケース別テンプレート

### 10.1 Create (単純リスト末尾追加)

```ts
updates: {
  Mutation: {
    createBookmark(result, _args, cache) {
      const QueryDoc = gql`{ bookmarks { id } }`;
      cache.updateQuery({ query: QueryDoc }, data => {
        if (!data) return data;
        return { ...data, bookmarks: [...data.bookmarks, result.createBookmark] };
      });
    },
  },
}
```

### 10.2 Delete (未知ページ)

```ts
removeBookmark(_r, args, cache) {
  cache.inspectFields('Query')
    .filter(f => f.fieldName === 'bookmarks')
    .forEach(f => {
      cache.updateQuery({ query: BookmarksPaged, variables: f.arguments }, data => {
        if (!data) return data;
        data.bookmarks = data.bookmarks.filter(b => b.id !== args.id);
        return data;
      });
    });
}
```

### 10.3 Entity 部分更新 (Mutation が scalar 返却)

```ts
updateBookmarkName(_r, args, cache) {
  cache.writeFragment(gql`fragment _ on Bookmark { id name }`, { id: args.id, name: args.name });
}
```

### 10.4 楽観的更新

```ts
optimistic: {
  toggleFavorite(args) {
    return { __typename: 'Bookmark', id: args.id, favorite: true };
  },
}
```

### 10.5 失敗時も再取得 (複雑影響): 無効化

```ts
updateBookmarkOrder(_r, _args, cache) {
  cache.invalidate('Bookmark'); // 全 Bookmark を再評価
}
```

---

## 11. 参考 API 一覧 (主に利用頻度順)

| メソッド | 用途 | 備考 |
|----------|------|------|
| `cache.updateQuery` | クエリ結果を読み書き (コピーを mutate OK) | data が null の場合あり (不足データ) |
| `cache.link` | リレーション(リンク)を直接差し替え | scalar には不可 |
| `cache.resolve` | リレーション / scalar の読取 | `fieldKey` 利用で引数再 stringify 回避 |
| `cache.writeFragment` | エンティティ部分更新 (scalar 含む) | gql DocumentNode 必須 |
| `cache.readFragment` | 部分読取 | - |
| `cache.inspectFields` | 既知フィールド列挙 (ページング対応) | Pagination / Invalidation 対象列挙 |
| `cache.invalidate` | エンティティ / フィールド 無効化 | refetch を誘発 |
| `cache.keyOfEntity` | Key 取得 | `{ __typename, id }` 以外の複合キー対応 |

---

## 付録: 実装チェックリスト

- [ ] Mutation が必要リンクを返しているか (返せるなら返す)
- [ ] Updater はリンク操作に限定し過剰な再取得をしていないか
- [ ] Pagination 対応は `inspectFields` で安全に列挙しているか
- [ ] null ケース (データ未キャッシュ) を防御しているか
- [ ] Optimistic は成功率の高い操作に絞っているか
- [ ] `cache` API 呼び出しは許可されたコンテキスト内か
- [ ] 型全体 `invalidate` は最後の手段になっているか

---

© 2025. Based on urql Graphcache official docs. Original content © respective authors. Licensed material summarized for internal project guidance.
