# Playwright E2E & API Test Automation Portfolio

[![Playwright Tests](https://github.com/wataru1638/playwright-e2e-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/wataru1638/playwright-e2e-portfolio/actions/workflows/playwright.yml)

[automationexercise.com](https://automationexercise.com) を対象にした、UIとAPIの両方をカバーするテスト自動化サンプルです。手動テストで培ったテスト設計(同値分割・境界値・ネガティブテスト)を、Playwright + TypeScriptで自動化しています。

## この構成のポイント

- **Page Object Model**: `tests/pages/` にページごとの操作・要素を集約し、`tests/specs/ui/` のテストコードからは「何をテストするか」だけを読み取れるようにしています。
- **UIとAPIを1つのフレームワークで**: `tests/specs/ui/` はブラウザ操作、`tests/specs/api/` はPlaywrightの`request`フィクスチャによるHTTPレベルのテストです。Playwrightの設定(`playwright.config.ts`)で`testMatch`を分け、APIテストは1回、UIテストは3ブラウザで実行されるようにしています。
- **公式テストケース/APIとのトレーサビリティ**: 対象サイトが公開している[26件の公式テストケース](https://automationexercise.com/test_cases)と[14件の公式API](https://automationexercise.com/api_list)のうち、代表的なシナリオをID単位で実装し、コード内コメントで対応関係を明記しています。
- **テスト設計技法を明示**: 正常系の再現だけでなく、ネガティブテスト(不正な認証情報・必須パラメータ欠如)、同値分割(検索結果の一致性)、状態遷移(アカウントの作成→取得→更新→削除のライフサイクル)を意識してケースを設計しています。
- **CI連携**: GitHub Actionsで push / PR ごとに自動実行し、失敗時はHTMLレポート・スクリーンショット・動画・トレースをアーティファクトとして保存します。
- **クロスブラウザ**: UIテストはChromium / Firefox / WebKitの3ブラウザで同一シナリオを実行します。

## 実装中に見つけたAPIの実際の挙動

対象APIは、ドキュメント上「Response Code: 405」等と書かれているものも**実際のHTTPステータスは常に200**で返り、本当のステータスはJSONボディの`responseCode`フィールドに入っています。

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://automationexercise.com/api/productsList
# => 200 (ドキュメントは405だが、トランスポート層は200)

curl -s -X POST https://automationexercise.com/api/productsList
# => {"responseCode": 405, "message": "This request method is not supported."}
```

`response.status()`だけを見るテストを書くと、ドキュメント通りに動いているAPIに対して誤って失敗する。ドキュメントを鵜呑みにせず実挙動を確認してからアサーションを書く、という手動テストで培った姿勢がそのまま自動化にも活きた例です(`tests/specs/api/products.spec.ts`にコメント付きで記録)。

## 実装済みテストケース

### UI (`tests/specs/ui/`)

| Test Case (公式) | シナリオ | ファイル |
| --- | --- | --- |
| TC03 | 誤ったメール/パスワードでのログイン失敗 | `login.spec.ts` |
| TC09 | 商品検索(該当あり/該当なし) | `product-search.spec.ts` |
| TC10 / TC11 | ホーム/カートページからのメルマガ購読 | `subscription.spec.ts` |
| TC12 | 複数商品のカート追加 | `cart.spec.ts` |
| TC13 | カート内の数量・小計の正確性 | `cart.spec.ts` |
| TC17 | カートからの商品削除 | `cart.spec.ts` |

### API (`tests/specs/api/`)

| API (公式) | シナリオ | ファイル |
| --- | --- | --- |
| API1 / API2 | 商品一覧の取得(GET) / 未対応メソッド(POST) | `products.spec.ts` |
| API3 / API4 | ブランド一覧の取得(GET) / 未対応メソッド(PUT) | `brands.spec.ts` |
| API5 / API6 | 商品検索(パラメータあり/なし) | `search-product.spec.ts` |
| API7-10 | ログイン検証(正常/パラメータ欠如/未対応メソッド/該当なし) | `login.spec.ts` |
| API11-14 | アカウントの作成→取得→更新→削除のライフサイクル | `account-lifecycle.spec.ts` |

アカウント作成を伴うテストは、テストごとに使い捨てのメールアドレスでアカウントを作成し、`afterAll`で必ず削除してテスト環境を汚さないようにしています。

対象サイトの公式一覧には会員登録〜購入完了までのUIフロー(TC14〜16)など未実装のシナリオも残っています。

## セットアップ

```bash
npm install
npx playwright install --with-deps
```

## 実行方法

```bash
# 全プロジェクト(API + UI×3ブラウザ)を実行
npm test

# APIテストのみ / UI(Chromiumのみ) / ヘッドあり / UIモード
npm run test:api
npm run test:chromium
npm run test:headed
npm run test:ui

# 直近の実行結果をHTMLレポートで確認
npm run report
```

## ディレクトリ構成

```
tests/
  pages/       # Page Object(UI要素定義 + 操作メソッド)
  api/         # APIテスト用のテストデータビルダー
  specs/
    ui/        # UIテストケース(3ブラウザで実行)
    api/       # APIテストケース(1回のみ実行)
  utils/       # テストデータ生成などの共通処理
playwright.config.ts
.github/workflows/playwright.yml
```

## 今後の拡張予定

- 会員登録〜購入完了までのUIシナリオ(公式TC14〜16)
- Allureレポートの導入とGitHub Pagesでの公開
- APIレスポンスのJSON Schemaバリデーション
