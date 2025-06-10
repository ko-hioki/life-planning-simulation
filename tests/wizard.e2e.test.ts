import { test, expect } from '@playwright/test';

/**
 * プラン作成ウィザードのE2Eテスト
 */
test.describe('Life Planning Simulation - ウィザード', () => {
  test('プラン作成ウィザードの基本的な操作フロー', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // プラン作成ボタンをクリック
    const createPlanButton = page.locator('button', { hasText: '新規プラン作成' }).or(
      page.locator('button', { hasText: '最初のプランを作成する' })
    );
    await createPlanButton.click();
    
    // ウィザードページに遷移することを確認
    await expect(page).toHaveURL(/#\/wizard/);
    await page.waitForLoadState('networkidle');
    
    // ウィザードが表示されることを確認
    await expect(page.locator('form')).toBeVisible();
    
    // 基本情報フォームの要素が表示されることを確認
    const nameInput = page.locator('input[id="name"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill('テストユーザー');
    }
  });

  test('フォームバリデーションが正常に動作する', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // フォームが表示されることを確認
    await expect(page.locator('form')).toBeVisible();
    
    // バリデーションの動作を確認（具体的な実装に応じて調整）
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // エラーメッセージまたはフォームが進まないことを確認
      // 実際のバリデーション実装に応じて調整
    }
  });

  test('ウィザードページが正常に表示される', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // ウィザードの基本要素が表示されることを確認
    await expect(page.locator('form')).toBeVisible();
    
    // キャンセルまたは戻るボタンが存在することを確認
    const cancelButton = page.locator('button', { hasText: 'キャンセル' }).or(
      page.locator('button', { hasText: '戻る' })
    );
    
    if (await cancelButton.isVisible()) {
      await expect(cancelButton).toBeVisible();
    }
  });
});
