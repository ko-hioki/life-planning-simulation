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
      
      // チャートコンテナ（ResponsiveContainer）が表示されることを確認
      const chartContainer = page.locator('.recharts-responsive-container').first();
      await expect(chartContainer).toBeVisible({ timeout: 10000 });
      
      // 統計情報の個別確認（実際のh3要素として存在するもの）
      await expect(page.locator('h3:has-text("最終資産")')).toBeVisible();
      await expect(page.locator('h3:has-text("最大資産")')).toBeVisible();
      await expect(page.locator('h3:has-text("退職時資産")')).toBeVisible();
      
      // モーダルを閉じる
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('ホームページでのグラフ表示', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ホームページのタイトルが表示されることを確認
    await expect(page.locator('h1:has-text("ライフプランニングシミュレーター")')).toBeVisible();
    
    // サンプルプランが存在する場合、詳細モーダルでチャートを確認
    const samplePlan = page.locator('text=サンプルプラン').first();
    if (await samplePlan.isVisible()) {
      // 詳細ボタンをクリック
      await page.click('button:has-text("詳細")');
      
      // チャートコンテナが表示されることを確認
      const chartContainer = page.locator('.recharts-responsive-container').first();
      await expect(chartContainer).toBeVisible({ timeout: 10000 });
      
      // モーダルを閉じる
      await page.keyboard.press('Escape');
    }
  });

  test('グラフの基本的な操作', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // サンプルプランが存在する場合、詳細モーダルでチャートの操作を確認
    const samplePlan = page.locator('text=サンプルプラン').first();
    if (await samplePlan.isVisible()) {
      // 詳細ボタンをクリック
      await page.click('button:has-text("詳細")');
      
      // チャートコンテナの存在確認
      const chartContainer = page.locator('.recharts-responsive-container').first();
      await expect(chartContainer).toBeVisible();
      
      // チャートコンテナがクリック可能であることを確認
      if (await chartContainer.isVisible()) {
        // チャート領域をクリック（エラーが発生しないことを確認）
        await chartContainer.click({ force: true });
      }
      
      // モーダルを閉じる
      await page.keyboard.press('Escape');
    }
  });

  test('統計カードの表示', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // サンプルプランが存在する場合、詳細モーダルで統計情報を確認
    const samplePlan = page.locator('text=サンプルプラン').first();
    if (await samplePlan.isVisible()) {
      // 詳細ボタンをクリック
      await page.click('button:has-text("詳細")');
      
      // 統計情報セクションが表示されることを確認
      await expect(page.locator('h3:has-text("詳細分析")')).toBeVisible();
      
      // 数値が表示されることを確認（万円形式）
      const amountElements = page.locator('text=/[0-9,]+万円/');
      await expect(amountElements.first()).toBeVisible();
      
      // モーダルを閉じる
      await page.keyboard.press('Escape');
    }
  });
});

/**
 * レスポンシブグラフ表示のテスト
 */
test.describe('Life Planning Simulation - レスポンシブグラフ', () => {
  test('モバイルでのグラフ表示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // サンプルプランが存在する場合、モバイルでのチャート表示を確認
    const samplePlan = page.locator('text=サンプルプラン').first();
    if (await samplePlan.isVisible()) {
      // 詳細ボタンをクリック
      await page.click('button:has-text("詳細")');
      
      // チャートが適切に表示されることを確認
      const chartContainer = page.locator('.recharts-responsive-container').first();
      await expect(chartContainer).toBeVisible();
      
      // 統計情報が適切に表示されることを確認
      await expect(page.locator('h3:has-text("最終資産")')).toBeVisible();
      
      // モーダルを閉じる
      await page.keyboard.press('Escape');
    }
  });

  test('デスクトップでのグラフ表示', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // サンプルプランが存在する場合、デスクトップでのチャート表示を確認
    const samplePlan = page.locator('text=サンプルプラン').first();
    if (await samplePlan.isVisible()) {
      // 詳細ボタンをクリック
      await page.click('button:has-text("詳細")');
      
      // チャートが適切に表示されることを確認
      const chartContainer = page.locator('.recharts-responsive-container').first();
      await expect(chartContainer).toBeVisible();
      
      // デスクトップでは統計情報がより詳細に表示されることを確認
      await expect(page.locator('h3:has-text("詳細分析")')).toBeVisible();
      
      // モーダルを閉じる
      await page.keyboard.press('Escape');
    }
  });
});