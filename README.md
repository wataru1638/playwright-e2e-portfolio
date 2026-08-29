# Playwright E2E Test Automation Portfolio

[![Playwright Tests](https://github.com/wataru1638/playwright-e2e-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/wataru1638/playwright-e2e-portfolio/actions/workflows/playwright.yml)

[automationexercise.com](https://automationexercise.com) を対象にした、Page Object Model 構成のE2Eテスト自動化サンプルです。手動テストで培ったテスト設計(同値分割・境界値・ネガティブテスト)を、Playwright + TypeScriptで自動化しています。

## この構成のポイント

- **Page Object Model**: `tests/pages/` にページごとの操作・要素を集約し、`tests/specs/` のテストコードからは「何をテストするか」だけを読み取れるようにしています。
- **公式テストケースとのトレーサビリティ**: 対象サイトが公開している[26件の公式テストケース](https://automationexercise.com/test_cases)のうち、代表的なシナリオをテストIDごとに実装し、コード内コメントで対応関係を明記しています。
- **テスト設計技法を明示**: 単なる正常系の再現ではなく、ネガティブテスト(不正な認証情報)、同値分割(検索結果の一致性)、境界値に近い考え方(空カート/複数商品)を意識してケースを設計しています。
- **CI連携**: GitHub Actionsで push / PR ごとに自動実行し、失敗時はHTMLレポート・スクリーンショット・動画・トレースをアーティファクトとして保存します。
- **クロスブラウザ**: Chromium / Firefox / WebKit の3ブラウザで同一シナリオを実行します。

## 実装済みテストケース

| Test Case (公式) | シナリオ | ファイル |
| --- | --- | --- |
| TC03 | 誤ったメール/パスワードでのログイン失敗 | `tests/specs/login.spec.ts` |
| TC09 | 商品検索(該当あり/該当なし) | `tests/specs/product-search.spec.ts` |
| TC10 / TC11 | ホーム/カートページからのメルマガ購読 | `tests/specs/subscription.spec.ts` |
| TC12 | 複数商品のカート追加 | `tests/specs/cart.spec.ts` |
| TC13 | カート内の数量・小計の正確性 | `tests/specs/cart.spec.ts` |
| TC17 | カートからの商品削除 | `tests/specs/cart.spec.ts` |

対象サイトの[公式テストケース一覧](https://automationexercise.com/test_cases)には会員登録・購入完了フローなど26件が定義されています。今回はアカウント作成を伴わない範囲(ログイン/検索/カート/購読)を優先実装しています。

## セットアップ

```bash
npm install
npx playwright install --with-deps
```

## 実行方法

```bash
# 全ブラウザで実行
npm test

# Chromiumのみ / ヘッドあり / UIモード
npm run test:chromium
npm run test:headed
npm run test:ui

# 直近の実行結果をHTMLレポートで確認
npm run report
```

## ディレクトリ構成

```
tests/
  pages/     # Page Object(要素定義 + 操作メソッド)
  specs/     # テストケース本体
  utils/     # テストデータ生成などの共通処理
playwright.config.ts
.github/workflows/playwright.yml
```

## 今後の拡張予定

- `automationexercise.com/api_list` を使ったAPIテスト自動化(REST Assured / pytest 相当をNode版で追加)
- 会員登録〜購入完了までのシナリオ(公式TC14〜16)
- Allureレポートの導入とGitHub Pagesでの公開
