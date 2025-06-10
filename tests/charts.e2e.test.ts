import { test, expect } from '@playwright/test';

/**
 * グラフ・チャート表示のE2Eテスト
 */
test.describe('Life Planning Simulation - グラフ・チャート', () => {
  test('サンプルプランのグラフ表示', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // サンプルプランが存在する場合のテスト
    const samplePlan = page.locator('text=サンプルプラン');
    
    if (await samplePlan.isVisible()) {
      // 詳細ボタンをクリック
      await page.click('text=詳細');
      
      // モーダルが開くことを確認
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // グラフが表示されることを確認（canvasまたはsvg要素）
      const chartElement = page.locator('canvas, svg').first();
      await expect(chartElement).toBeVisible({ timeout: 10000 });
      
      // 統計情報が表示されることを確認
      const statsElement = page.locator('text=退職時資産, text=最大資産, text=累計収入').first();
      await expect(statsElement).toBeVisible();
      
      // モーダルを閉じる
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('テストページでのグラフ表示', async ({ page }) => {
    await page.goto('/test');
    await page.waitForLoadState('networkidle');
    
    // テストページのタイトルが表示されることを確認
    await expect(page.locator('h1')).toContainText('テスト用シミュレーション結果');
    
    // グラフが表示されることを確認
    const chartElement = page.locator('canvas, svg').first();
    await expect(chartElement).toBeVisible({ timeout: 10000 });
    
    // 統計情報が表示されることを確認
    const statsSection = page.locator('text=統計情報, text=退職時資産, text=最大資産').first();
    await expect(statsSection).toBeVisible();
  });

  test('グラフの基本的な操作', async ({ page }) => {
    await page.goto('/test');
    await page.waitForLoadState('networkidle');
    
    // グラフ要素の存在確認
    const chartContainer = page.locator('canvas, svg').first();
    await expect(chartContainer).toBeVisible();
    
    // グラフコンテナがクリック可能であることを確認
    if (await chartContainer.isVisible()) {
      // グラフ領域をクリック（エラーが発生しないことを確認）
      await chartContainer.click({ force: true });
    }
  });

  test('統計カードの表示', async ({ page }) => {
    await page.goto('/test');
    await page.waitForLoadState('networkidle');
    
    // 統計カードが表示されることを確認
    const statsCards = page.locator('[class*="card"], [class*="Card"]');
    await expect(statsCards.first()).toBeVisible();
    
    // 数値が表示されることを確認（金額形式）
    const amountElements = page.locator('text=/¥[0-9,]+/, text=/[0-9,]+万円/, text=/[0-9,]+円/');
    await expect(amountElements.first()).toBeVisible();
  });
});

/**
 * レスポンシブグラフ表示のテスト
 */
test.describe('Life Planning Simulation - レスポンシブグラフ', () => {
  test('モバイルでのグラフ表示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/test');
    await page.waitForLoadState('networkidle');
    
    // グラフが適切に表示されることを確認
    const chartElement = page.locator('canvas, svg').first();
    await expect(chartElement).toBeVisible();
    
    // 統計情報が適切に表示されることを確認
    const statsSection = page.locator('text=統計情報, text=退職時資産').first();
    await expect(statsSection).toBeVisible();
  });

  test('デスクトップでのグラフ表示', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/test');
    await page.waitForLoadState('networkidle');
    
    // グラフが適切に表示されることを確認
    const chartElement = page.locator('canvas, svg').first();
    await expect(chartElement).toBeVisible();
    
    // レイアウトが適切に表示されることを確認
    const container = page.locator('main, [class*="container"]').first();
    await expect(container).toBeVisible();
  });
});