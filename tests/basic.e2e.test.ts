import { test, expect } from '@playwright/test';

/**
 * アプリケーションの基本動作E2Eテスト
 */
test.describe('Life Planning Simulation - 基本動作', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にトップページに移動
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('ホームページが正しく表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/Life Planning Simulation/);
    
    // メインヘッダーの確認
    await expect(page.locator('h1')).toContainText('ライフプランニングシミュレーター');
    
    // 新規プラン作成ボタンの確認
    await expect(page.locator('text=新規プラン作成')).toBeVisible();
    
    // ヘッダーナビゲーションの確認
    await expect(page.locator('header')).toBeVisible();
  });

  test('ホームページの基本要素が表示される', async ({ page }) => {
    // サンプルプランが存在する場合の表示確認
    const samplePlan = page.locator('text=サンプルプラン');
    const welcomeMessage = page.locator('text=最初のプランを作成する');
    
    // サンプルプランまたはウェルカムメッセージのいずれかが表示される
    await expect(samplePlan.or(welcomeMessage)).toBeVisible({ timeout: 10000 });
    
    // フッターの確認
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('text=ライフプランニングシミュレーター. All rights reserved.')).toBeVisible();
  });

  test('新規プラン作成フローの基本動作', async ({ page }) => {
    // 新規プラン作成ボタンをクリック
    await page.click('text=新規プラン作成');
    
    // ウィザードページに遷移することを確認
    await expect(page).toHaveURL(/.*#\/wizard/);
    await expect(page.locator('text=ライフプラン作成')).toBeVisible();
    
    // ホームに戻るボタンで戻れることを確認
    await page.click('text=ホームに戻る');
    await expect(page).toHaveURL(/.*#\/$/);
    await expect(page.locator('h1')).toContainText('ライフプランニングシミュレーター');
  });

  test('レスポンシブデザインの基本確認', async ({ page }) => {
    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // ヘッダーが表示される
    await expect(page.locator('header')).toBeVisible();
    
    // メインコンテンツが表示される
    await expect(page.locator('main')).toBeVisible();
    
    // デスクトップサイズでテスト
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    // 同じ要素が表示される
    await expect(page.locator('h1')).toContainText('ライフプランニングシミュレーター');
    await expect(page.locator('text=新規プラン作成')).toBeVisible();
  });
});
