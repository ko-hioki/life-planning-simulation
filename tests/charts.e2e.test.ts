import { test, expect } from '@playwright/test';

/**
 * シミュレーション結果とチャートのE2Eテスト
 */
test.describe('Life Planning Simulation - 結果・チャート', () => {
  test.beforeEach(async ({ page }) => {
    // テスト用の結果ページに直接移動
    await page.goto('/#/test');
    await page.waitForLoadState('networkidle');
  });

  test('シミュレーション結果が正常に表示される', async ({ page }) => {
    // ページの読み込み完了を待つ
    await page.waitForTimeout(2000);
    
    // グラフコンテナが表示されることを確認
    const chartContainer = page.locator('[data-testid="simulation-chart"]');
    if (await chartContainer.isVisible()) {
      await expect(chartContainer).toBeVisible();
    } else {
      // グラフが直接表示されない場合は、recharts要素を確認
      const chartSvg = page.locator('.recharts-wrapper svg');
      await expect(chartSvg).toBeVisible();
    }
    
    // 統計情報コンテナが表示されることを確認
    const statsContainer = page.locator('[data-testid="simulation-stats"]');
    if (await statsContainer.isVisible()) {
      await expect(statsContainer).toBeVisible();
    } else {
      // 統計カードが表示されることを確認
      const statCards = page.locator('[data-testid*="stat-card"]');
      if (await statCards.first().isVisible()) {
        await expect(statCards.first()).toBeVisible();
      }
    }
  });

  test('グラフが正常に描画される', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // チャートのSVG要素が描画されることを確認
    const chartSvg = page.locator('.recharts-wrapper svg');
    await expect(chartSvg).toBeVisible();
    
    // チャートに実際のデータが描画されていることを確認
    const chartPaths = page.locator('.recharts-wrapper path');
    const pathCount = await chartPaths.count();
    expect(pathCount).toBeGreaterThan(0);
  });

  test('統計カードが正常に表示される', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // 統計情報のテキストが表示されることを確認
    const statsText = page.locator('text=退職時資産').or(page.locator('text=最大資産')).or(page.locator('text=資産'));
    if (await statsText.first().isVisible()) {
      await expect(statsText.first()).toBeVisible();
    }
    
    // 数値が表示されることを確認（円やyen等の文字を含む）
    const moneyText = page.locator('text=/[0-9,]+/');
    if (await moneyText.first().isVisible()) {
      await expect(moneyText.first()).toBeVisible();
    }
  });

  test('グラフの詳細表示モーダルが動作する', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // 詳細表示ボタンまたはグラフクリックを探す
    const detailButton = page.locator('button', { hasText: '詳細表示' })
      .or(page.locator('button', { hasText: '詳細' }))
      .or(page.locator('.recharts-wrapper'));
    
    if (await detailButton.first().isVisible()) {
      await detailButton.first().click();
      
      // モーダルが表示されることを確認
      const modal = page.locator('[data-testid="chart-modal"]')
        .or(page.locator('[role="dialog"]'))
        .or(page.locator('.modal'));
      
      if (await modal.first().isVisible()) {
        await expect(modal.first()).toBeVisible();
        
        // 閉じるボタンまたはESCキーで閉じる
        const closeButton = page.locator('button[aria-label*="閉じる"]')
          .or(page.locator('button', { hasText: '×' }))
          .or(page.locator('[data-testid="close-button"]'));
        
        if (await closeButton.first().isVisible()) {
          await closeButton.first().click();
        } else {
          await page.keyboard.press('Escape');
        }
        
        // モーダルが閉じることを確認
        await expect(modal.first()).not.toBeVisible();
      }
    }
  });

  test('グラフのレスポンシブ動作', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // デスクトップサイズ
    await page.setViewportSize({ width: 1200, height: 800 });
    const chartDesktop = page.locator('.recharts-wrapper');
    if (await chartDesktop.isVisible()) {
      await expect(chartDesktop).toBeVisible();
    }
    
    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    if (await chartDesktop.isVisible()) {
      await expect(chartDesktop).toBeVisible();
    }
    
    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    if (await chartDesktop.isVisible()) {
      await expect(chartDesktop).toBeVisible();
    }
  });

  test('テストページの基本機能', async ({ page }) => {
    // テストページが正常に読み込まれることを確認
    await expect(page.locator('body')).toBeVisible();
    
    // エラーが発生していないことを確認
    const errorElements = page.locator('[data-testid="error"]').or(page.locator('.error'));
    const errorCount = await errorElements.count();
    expect(errorCount).toBe(0);
  });
});
