# マークダウンボタン記法 使用方法ガイド

## 基本的な使い方

マークダウンファイル内で以下の記法を使用することで、自動的にボタンに変換されます。

### 基本構文
```
[!ボタンタイプ](URL "表示テキスト")
```

- **URL**: リンク先のURL（相対パス・絶対パス両方対応）
- **表示テキスト**: ボタンに表示する文字（省略可能）

## 利用可能なボタンタイプ

### 1. ダウンロードボタン
```markdown
[!download](./files/sample.zip "サンプルファイルをダウンロード")
[!download](./files/tool.exe)  # テキスト省略時は「ダウンロード」
```
[!download](./files/sample.zip "サンプルファイルをダウンロード")
[!download](./files/tool.exe)


### 2. リンクボタン
```markdown
[!link](https://example.com "公式サイトへ")
[!link](../other-page.html "関連ページ")
```
[!link](https://example.com "公式サイトへ")
[!link](../other-page.html "関連ページ")

### 3. GitHubボタン
```markdown
[!github](https://github.com/user/repo "ソースコードを見る")
[!github](https://github.com/user/repo)  # デフォルト: "GitHubで見る"
```
[!github](https://github.com/user/repo "ソースコードを見る")
[!github](https://github.com/user/repo)

### 4. デモ・プレビューボタン
```markdown
[!demo](./demo/index.html "デモを試す")
[!demo](https://example.com/preview "プレビュー")
```
[!demo](./demo/index.html "デモを試す")
[!demo](https://example.com/preview "プレビュー")

### 5. 関連コンテンツボタン
```markdown
[!related](./related-article.html "関連記事を読む")
[!related](../notes/tips.html "開発Tips")
```
[!related](./related-article.html "関連記事を読む")
[!related](../notes/tips.html "開発Tips")

### 6. 注意・警告ボタン
```markdown
[!warning](./important.html "重要な注意事項")
[!warning](#troubleshooting "トラブルシューティング")
```
[!warning](./important.html "重要な注意事項")
[!warning](#troubleshooting "トラブルシューティング")

### 7. 情報ボタン
```markdown
[!info](./readme.html "詳細な使用方法")
[!info](https://docs.example.com "公式ドキュメント")
```
[!info](./readme.html "詳細な使用方法")
[!info](https://docs.example.com "公式ドキュメント")

### 8. セカンダリボタン
```markdown
[!secondary](./optional.html "オプション設定")
[!secondary](./archive.html "過去のバージョン")
```
[!secondary](./optional.html "オプション設定")
[!secondary](./archive.html "過去のバージョン")

## レイアウト機能

### ボタンを中央寄せ
```markdown
[!center]
[!download](./file.zip "ファイルをダウンロード")
[!/center]
```
[!center]
[!download](./file.zip "ファイルをダウンロード")
[!/center]

### ボタンを横幅いっぱいに
```markdown
[!full]
[!download](./file.zip "重要なファイル")
[!/full]
```
[!full]
[!download](./file.zip "重要なファイル")
[!/full]


### ボタンをグループ化（横並び）
```markdown
[!group]
[!demo](./demo.html "デモ")
[!github](https://github.com/user/repo "GitHub")
[!download](./file.zip "ダウンロード")
[!/group]
```
[!group]
[!demo](./demo.html "デモ")
[!github](https://github.com/user/repo "GitHub")
[!download](./file.zip "ダウンロード")
[!/group]

### サイズ変更（将来実装予定）
```markdown
[!small-download](./file.zip "小さいボタン")
[!large-demo](./demo.html "大きいボタン")
```
[!small-download](./file.zip "小さいボタン")
[!large-demo](./demo.html "大きいボタン")

## 使用例

### 基本的な使用例
```markdown
# プロジェクト紹介

このプロジェクトは...

## ダウンロード
以下からファイルをダウンロードできます：

[!download](./releases/v1.0.0.zip "最新版ダウンロード")

## 関連リンク
[!group]
[!github](https://github.com/user/project "ソースコード")
[!demo](./demo/index.html "オンラインデモ")
[!info](./docs/manual.html "使用方法")
[!/group]
```

### 複数ボタンの組み合わせ例
```markdown
## 利用可能なリソース

### メインコンテンツ
[!center]
[!download](./main-content.zip "メインファイル")
[!/center]

### 補助資料
[!group]
[!info](./manual.pdf "使用マニュアル")
[!warning](./caution.html "注意事項")
[!related](./samples/ "サンプル集")
[!/group]

### 外部リンク
[!link](https://official-site.com "公式サイト")
[!github](https://github.com/user/repo "GitHub Repository")
```

## 注意事項

- 記法は必ず半角文字で記述してください
- URLにスペースが含まれる場合は、適切にエンコードしてください
- 外部リンクは自動的に新しいタブで開きます
- 表示テキストを省略した場合、各ボタンタイプのデフォルトテキストが使用されます

## カスタマイズ

CSSを編集すれば、ボタンの色やスタイルを自由にカスタマイズできます。各ボタンには以下のクラスが付与されます：

- `.btn-download` - ダウンロードボタン
- `.btn-link` - リンクボタン  
- `.btn-github` - GitHubボタン
- `.btn-demo` - デモボタン
- `.btn-related` - 関連コンテンツボタン
- `.btn-warning` - 警告ボタン
- `.btn-info` - 情報ボタン
- `.btn-secondary` - セカンダリボタン