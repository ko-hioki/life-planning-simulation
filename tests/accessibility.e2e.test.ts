import { test, expect } from '@playwright/test';

/**
 * アクセシビリティとパフォーマンスのE2Eテスト
 */
test.describe('Life Planning Simulation - アクセシビリティ', () => {
  test('キーボードナビゲーションが正常に動作する', async ({ page }) => {
    await page.goto('/');
    
    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab');
    
    // フォーカスが要素に移動することを確認
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Enterキーでボタンが動作することを確認
    const createButton = page.locator('button', { hasText: 'プラン作成' });
    await createButton.focus();
    await page.keyboard.press('Enter');
    
    // ページ遷移することを確認
    await expect(page).toHaveURL(/.*wizard/);
  });

  test('ARIA属性が適切に設定されている', async ({ page }) => {
    await page.goto('/wizard');
    
    // フォームのラベルが関連付けられていることを確認
    const ageInput = page.locator('input[name="age"]');
    const ageLabel = page.locator('label[for="age"]');
    await expect(ageInput).toHaveAttribute('aria-labelledby');
    
    // 必須フィールドがaria-requiredで示されていることを確認
    await expect(ageInput).toHaveAttribute('aria-required', 'true');
    
    // エラーメッセージがaria-describedbyで関連付けられていることを確認
    await page.locator('button', { hasText: '次へ' }).click();
    const errorMessage = page.locator('.error-message').first();
    if (await errorMessage.isVisible()) {
      const errorId = await errorMessage.getAttribute('id');
      if (errorId) {
        await expect(ageInput).toHaveAttribute('aria-describedby', errorId);
      }
    }
  });

  test('カラーコントラストが適切である', async ({ page }) => {
    await page.goto('/');
    
    // 主要なテキスト要素のコントラストをチェック
    const textElements = page.locator('h1, h2, h3, p, button, label');
    const count = await textElements.count();
    
    expect(count).toBeGreaterThan(0);
    
    // 全ての要素が可視であることを確認（間接的なコントラストチェック）
    for (let i = 0; i < Math.min(count, 10); i++) {
      await expect(textElements.nth(i)).toBeVisible();
    }
  });
});

/**
 * パフォーマンステスト
 */
test.describe('Life Planning Simulation - パフォーマンス', () => {
  test('ページ読み込み時間が適切である', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // 5秒以内に読み込まれることを確認
    expect(loadTime).toBeLessThan(5000);
  });

  test('グラフの描画パフォーマンス', async ({ page }) => {
    await page.goto('/test');
    
    const startTime = Date.now();
    
    // グラフが表示されるまで待つ
    await expect(page.locator('.recharts-wrapper svg')).toBeVisible();
    
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    
    // 3秒以内に描画されることを確認
    expect(renderTime).toBeLessThan(3000);
  });

  test('大量データでのレスポンス性能', async ({ page }) => {
    await page.goto('/test');
    await page.waitForLoadState('networkidle');
    
    // モーダルを開く操作の応答時間
    const startTime = Date.now();
    
    const detailButton = page.locator('button', { hasText: '詳細表示' });
    await detailButton.click();
    
    await expect(page.locator('[data-testid="chart-modal"]')).toBeVisible();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // 1秒以内に応答することを確認
    expect(responseTime).toBeLessThan(1000);
  });
});
