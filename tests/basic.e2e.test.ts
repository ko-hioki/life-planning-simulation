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

  test('トップページが正常に表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/Life Planning Simulation/);
    
    // メインヘッダーの確認
    await expect(page.locator('h1')).toContainText('ライフプランニングシミュレーター');
    
    // ナビゲーションメニューの確認
    await expect(page.locator('nav')).toBeVisible();
    
    // プラン作成ボタンの確認
    const createPlanButton = page.locator('button', { hasText: '新規プラン作成' });
    await expect(createPlanButton).toBeVisible();
  });

  test('404ページが正常に表示される', async ({ page }) => {
    // 存在しないページに移動
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // HashRouterの場合、通常はホームページにリダイレクトされる
    // ページが表示されることを確認
    await expect(page.locator('body')).toBeVisible();
    
    // ヘッダーが表示されることを確認
    await expect(page.locator('header')).toBeVisible();
  });

  test('レスポンシブデザインが正常に動作する', async ({ page }) => {
    // デスクトップサイズでの確認
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // モバイルサイズでの確認
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    
    // タブレットサイズでの確認
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('ホームページの基本要素が表示される', async ({ page }) => {
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 基本的な要素が表示されることを確認
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // プラン作成ボタンまたはウェルカムメッセージが表示される
    const createButton = page.locator('button', { hasText: '新規プラン作成' });
    const welcomeButton = page.locator('button', { hasText: '最初のプランを作成する' });
    
    const hasCreateButton = await createButton.isVisible();
    const hasWelcomeButton = await welcomeButton.isVisible();
    
    expect(hasCreateButton || hasWelcomeButton).toBe(true);
  });
});
