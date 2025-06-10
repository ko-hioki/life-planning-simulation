# E2Eテストガイド

## 概要
このプロジェクトでは、Playwrightを使用してE2E（End-to-End）テストを実装しています。

## セットアップ
```bash
# 依存関係のインストール（既に完了済み）
yarn install

# Playwrightブラウザのインストール
npx playwright install
```

## テストファイル構成
```
tests/
├── basic.e2e.test.ts         # 基本的なページ表示テスト
├── wizard.e2e.test.ts        # ウィザード機能のテスト
├── charts.e2e.test.ts        # グラフ・結果表示のテスト
├── accessibility.e2e.test.ts # アクセシビリティ・パフォーマンステスト
└── fixtures.ts               # 共通のテストヘルパー
```

## テスト実行コマンド
```bash
# 全E2Eテストを実行
yarn test:e2e

# UIモードでテストを実行（ブラウザで確認しながら）
yarn test:e2e:ui

# デバッグモードでテストを実行
yarn test:e2e:debug

# テストレポートを表示
yarn test:e2e:report

# 特定のテストファイルのみ実行
yarn test:e2e tests/basic.e2e.test.ts

# 特定のブラウザでのみ実行
yarn test:e2e --project=chromium
```

## テストシナリオ

### 1. 基本動作テスト (`basic.e2e.test.ts`)
- トップページの表示確認
- 404ページの動作確認
- レスポンシブデザインの確認

### 2. ウィザードテスト (`wizard.e2e.test.ts`)
- プラン作成ウィザードの操作フロー
- フォームバリデーションの動作
- ウィザードの戻る機能
- プラン完成後の結果表示

### 3. グラフ・結果テスト (`charts.e2e.test.ts`)
- シミュレーション結果の表示
- 統計カードの表示
- グラフの詳細表示モーダル
- モーダルのアクセシビリティ
- レスポンシブ動作

### 4. アクセシビリティテスト (`accessibility.e2e.test.ts`)
- キーボードナビゲーション
- ARIA属性の適切な設定
- カラーコントラスト
- パフォーマンス測定

## テスト環境
- **ベースURL**: `http://localhost:4173` (vite preview)
- **対応ブラウザ**: Chromium、Firefox、WebKit
- **モバイル対応**: Pixel 5、iPhone 12でのテスト

## CI/CD統合
GitHub Actionsでの自動実行については、以下の設定を追加予定：
```yaml
- name: Run E2E tests
  run: |
    yarn build
    yarn test:e2e
```

## トラブルシューティング

### テストが失敗する場合
1. アプリケーションが正常にビルドできることを確認
2. `yarn preview`でプレビューサーバーが起動することを確認
3. ブラウザが正しくインストールされているか確認: `npx playwright install`

### デバッグ方法
1. `yarn test:e2e:debug`でデバッグモードで実行
2. `yarn test:e2e:ui`でUIモードで確認
3. テスト失敗時のスクリーンショットは`test-results/`フォルダに保存される

## ベストプラクティス
1. **テストの独立性**: 各テストは独立して実行できるようにする
2. **適切な待機**: `page.waitForLoadState()`や`expect().toBeVisible()`を活用
3. **セレクタの安定性**: `data-testid`属性を活用した安定したセレクタを使用
4. **レスポンシブテスト**: 複数の画面サイズでのテストを実施
5. **アクセシビリティ**: キーボード操作やARIA属性のテストを含める
