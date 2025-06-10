import { defineConfig, devices } from '@playwright/test';

/**
 * Playwrightの設定ファイル
 * E2Eテストの実行環境とブラウザ設定を定義
 */
export default defineConfig({
  // テストディレクトリ
  testDir: './tests',
  
  // テストファイルのパターン
  testMatch: '**/*.e2e.{test,spec}.{ts,js}',

  // 並列実行しない（UIテストの安定性のため）
  fullyParallel: false,
  
  // CIで失敗時はretryしない
  forbidOnly: !!process.env.CI,
  
  // CIではretryしない
  retries: process.env.CI ? 0 : 1,
  
  // 並列実行のワーカー数
  workers: process.env.CI ? 1 : undefined,
  
  // レポーター設定
  reporter: [
    ['html'],
    ['line'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // 全テスト共通の設定
  use: {
    // ベースURL（開発サーバーまたはビルド済みアプリ）
    baseURL: 'http://localhost:4173', // vite preview用のポート
    
    // トレース設定（失敗時のみ）
    trace: 'on-first-retry',
    
    // スクリーンショット設定
    screenshot: 'only-on-failure',
    
    // ビデオ設定
    video: 'retain-on-failure',
    
    // テストの実行速度を適度に調整
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // プロジェクト設定（複数ブラウザでのテスト）
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // webkit系はmacOS環境で問題があるため一時的に無効化
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // モバイルテスト
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    // webkit系はmacOS環境で問題があるため一時的に無効化
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // 開発サーバーの起動設定
  webServer: {
    command: 'yarn preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
