import { test, expect } from '@playwright/test';

/**
 * プラン作成ウィザードのE2Eテスト
 */
test.describe('Life Planning Simulation - ウィザード', () => {
  test('プラン作成ウィザードへの遷移', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 新規プラン作成ボタンをクリック
    await page.click('text=新規プラン作成');
    
    // ウィザードページに遷移することを確認
    await expect(page).toHaveURL(/.*\/wizard/);
    
    // ウィザードのヘッダーが表示されることを確認
    await expect(page.locator('text=ライフプラン作成')).toBeVisible();
  });

  test('ウィザードページの基本表示', async ({ page }) => {
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');
    
    // ウィザードタイトルが表示されることを確認
    await expect(page.locator('text=ライフプラン作成')).toBeVisible();
    
    // ホームに戻るボタンが表示されることを確認
    await expect(page.locator('text=ホームに戻る')).toBeVisible();
    
    // プログレスバーが表示されることを確認
    await expect(page.locator('[data-testid="wizard-progress"]')).toBeVisible();
  });

  test('基本情報フォームの表示', async ({ page }) => {
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');
    
    // 基本情報ステップが表示されることを確認
    await expect(page.locator('text=基本情報')).toBeVisible();
    
    // 入力フィールドが表示されることを確認
    const inputFields = page.locator('input');
    await expect(inputFields.first()).toBeVisible();
  });

  test('ウィザードナビゲーション', async ({ page }) => {
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');
    
    // ホームに戻るボタンのクリックテスト
    await page.click('text=ホームに戻る');
    
    // ホームページに戻ることを確認
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('ライフプランニングシミュレーター');
  });

  test('キャンセルボタンの動作', async ({ page }) => {
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');
    
    // キャンセルボタンが表示されることを確認
    const cancelButton = page.locator('text=キャンセル');
    await expect(cancelButton).toBeVisible();
    
    // キャンセルボタンをクリック
    await cancelButton.click();
    
    // ホームページに戻ることを確認
    await expect(page).toHaveURL('/');
  });
});

/**
 * プラン作成ウィザードの詳細操作テスト
 */
test.describe('Life Planning Simulation - ウィザード詳細', () => {
  test('ウィザードページが正常に表示される', async ({ page }) => {
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');
    
    // ウィザードの基本要素が表示されることを確認
    await expect(page.locator('body')).toBeVisible();
    
    // ヘッダーが表示されることを確認
    await expect(page.locator('h1')).toContainText('ライフプランニングシミュレーター');
  });

  test('フォーム入力の基本動作', async ({ page }) => {
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');
    
    // 最初の入力フィールドに値を入力
    const firstInput = page.locator('input').first();
    if (await firstInput.isVisible()) {
      await firstInput.fill('テストユーザー');
      await expect(firstInput).toHaveValue('テストユーザー');
    }
  });

  test('プログレスバーの表示', async ({ page }) => {
    await page.goto('/wizard');
    await page.waitForLoadState('networkidle');
    
    // プログレスバーが表示されることを確認
    const progressBar = page.locator('[data-testid="wizard-progress"]');
    await expect(progressBar).toBeVisible();
    
    // プログレスバーの値が設定されていることを確認
    const progressElement = progressBar.locator('div').first();
    await expect(progressElement).toBeVisible();
  });
});
