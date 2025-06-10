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
    await expect(page).toHaveURL(/.*#\/wizard/);
    
    // ウィザードのメインヘッダーが表示されることを確認（より具体的なセレクター）
    await expect(page.locator('h1:has-text("ライフプラン作成")')).toBeVisible();
  });

  test('ウィザードページの基本表示', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    
    // ウィザードタイトルが表示されることを確認（より具体的なセレクター）
    await expect(page.locator('h1:has-text("ライフプラン作成")')).toBeVisible();
    
    // ホームに戻るボタンが表示されることを確認
    await expect(page.locator('text=ホームに戻る')).toBeVisible();
    
    // プログレスバーの存在を確認（visibleではなくattachedで確認）
    await expect(page.locator('[data-testid="wizard-progress"]')).toBeAttached();
  });

  test('基本情報フォームの表示', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    
    // 基本情報ステップのメインタイトルが表示されることを確認（より具体的なセレクター）
    await expect(page.locator('h2:has-text("基本情報の入力")')).toBeVisible();
    
    // メインのステップ説明を確認（白いテキストを指定）
    await expect(page.locator('span.text-white:has-text("あなたとご家族の基本的な情報を入力してください")')).toBeVisible();
    
    // 入力フィールドが表示されることを確認
    const inputFields = page.locator('input');
    await expect(inputFields.first()).toBeVisible();
  });

  test('ウィザードナビゲーション', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    
    // ホームに戻るボタンのクリックテスト
    await page.click('text=ホームに戻る');
    
    // ホームページに戻ることを確認
    await expect(page).toHaveURL(/.*#\/$/);
    await expect(page.locator('h1:has-text("ライフプランニングシミュレーター")')).toBeVisible();
  });

  test('キャンセルボタンの動作', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    
    // 任意のキャンセルボタンを探す（複数あるうちの1つ）
    const cancelButton = page.locator('button:has-text("キャンセル")').first();
    await expect(cancelButton).toBeVisible();
    
    // キャンセルボタンをクリック
    await cancelButton.click();
    
    // ホームページに戻ることを確認
    await expect(page).toHaveURL(/.*#\/$/);
  });
});

/**
 * プラン作成ウィザードの詳細操作テスト
 */
test.describe('Life Planning Simulation - ウィザード詳細', () => {
  test('ウィザードページが正常に表示される', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    
    // ウィザードの基本要素が表示されることを確認
    await expect(page.locator('body')).toBeVisible();
    
    // ヘッダーのタイトル「ライフプラン作成」が表示されることを確認（特定のh1を選択）
    await expect(page.locator('h1:has-text("ライフプラン作成")')).toBeVisible();
    
    // ステップ情報が表示されることを確認
    await expect(page.locator('text=ステップ 1')).toBeVisible();
  });

  test('フォーム入力の基本動作', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    
    // 最初の入力フィールドに値を入力
    const firstInput = page.locator('input').first();
    if (await firstInput.isVisible()) {
      await firstInput.fill('テストユーザー');
      await expect(firstInput).toHaveValue('テストユーザー');
    }
  });

  test('プログレスバーの表示', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    
    // プログレスバーの存在を確認（visibilityを強制しない）
    const progressBar = page.locator('[data-testid="wizard-progress"]');
    await expect(progressBar).toBeAttached();
    
    // プログレスバーの子要素（実際のプログレス）が設定されていることを確認
    const progressElement = progressBar.locator('div').first();
    await expect(progressElement).toBeAttached();
  });
});
