import { test, expect } from '@playwright/test';

/**
 * アクセシビリティとユーザビリティのE2Eテスト
 */
test.describe('Life Planning Simulation - アクセシビリティ', () => {
  test('キーボードナビゲーション基本動作', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 新規プラン作成ボタンがTabキーで選択可能
    await page.keyboard.press('Tab');
    
    // フォーカスが設定されているか確認
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('ヘッダー要素のアクセシビリティ', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // メインヘッダー(h1)が存在することを確認
    await expect(page.locator('h1')).toContainText('ライフプランニングシミュレーター');
    
    // ヘッダー要素が存在することを確認
    await expect(page.locator('header')).toBeVisible();
    
    // メインコンテンツが存在することを確認
    await expect(page.locator('main')).toBeVisible();
  });

  test('モーダルのアクセシビリティ', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // サンプルプランが存在する場合のモーダルテスト
    const samplePlan = page.locator('text=サンプルプラン');
    
    if (await samplePlan.isVisible()) {
      // 詳細ボタンをクリック
      await page.click('text=詳細');
      
      // モーダルが適切な役割属性を持つことを確認
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // ESCキーでモーダルが閉じることを確認
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('ウィザードのアクセシビリティ', async ({ page }) => {
    await page.goto('/#/wizard');
    await page.waitForLoadState('networkidle');
    
    // ウィザードのタイトルが適切に設定されていることを確認
    await expect(page.locator('text=ライフプラン作成')).toBeVisible();
    
    // プログレスバーが表示されることを確認
    await expect(page.locator('[data-testid="wizard-progress"]')).toBeVisible();
    
    // フォーム要素にアクセスできることを確認
    const nameInput = page.locator('input').first();
    if (await nameInput.isVisible()) {
      await nameInput.focus();
      await expect(nameInput).toBeFocused();
    }
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    // モバイルサイズでのアクセシビリティ
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // ヘッダーが表示される
    await expect(page.locator('header')).toBeVisible();
    
    // メインコンテンツが表示される
    await expect(page.locator('main')).toBeVisible();
    
    // デスクトップサイズでの確認
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toContainText('ライフプランニングシミュレーター');
  });
});

/**
 * 基本的なパフォーマンステスト
 */
test.describe('Life Planning Simulation - パフォーマンス', () => {
  test('ページ読み込み時間チェック', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // 読み込み時間が10秒以内であることを確認
    expect(loadTime).toBeLessThan(10000);
  });

  test('基本的なレンダリング性能', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // メインコンテンツが即座に表示される
    await expect(page.locator('main')).toBeVisible();
    
    // ヘッダーが即座に表示される
    await expect(page.locator('header')).toBeVisible();
  });
});