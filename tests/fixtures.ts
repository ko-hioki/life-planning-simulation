import { test as base } from '@playwright/test';

/**
 * カスタムテストフィクスチャ
 * テスト間で共通に使用するヘルパー関数やデータを定義
 */
export const test = base.extend<{
  // 共通のテストデータ
  testUser: {
    age: number;
    monthlyIncome: number;
    currentAssets: number;
    retirementAge: number;
  };
  
  // 共通のヘルパー関数
  wizardHelper: {
    fillBasicInfo: (page: any, data: any) => Promise<void>;
    completeWizard: (page: any) => Promise<void>;
    skipToResults: (page: any) => Promise<void>;
  };
}>({
  // テストユーザーデータ
  testUser: async ({}, use) => {
    const userData = {
      age: 30,
      monthlyIncome: 400000,
      currentAssets: 1000000,
      retirementAge: 65,
    };
    await use(userData);
  },

  // ウィザードヘルパー
  wizardHelper: async ({ page }, use) => {
    const helper = {
      async fillBasicInfo(page: any, data: any) {
        await page.locator('input[name="age"]').fill(data.age.toString());
        await page.locator('input[name="monthlyIncome"]').fill(data.monthlyIncome.toString());
        await page.locator('input[name="currentAssets"]').fill(data.currentAssets.toString());
      },

      async completeWizard(page: any) {
        // ステップ1: 基本情報
        await page.locator('input[name="age"]').fill('30');
        await page.locator('input[name="monthlyIncome"]').fill('400000');
        await page.locator('input[name="currentAssets"]').fill('1000000');
        await page.locator('button', { hasText: '次へ' }).click();

        // ステップ2〜4: 最小限の入力で進む
        for (let step = 2; step <= 4; step++) {
          const nextButton = page.locator('button', { hasText: step === 4 ? '完了' : '次へ' });
          if (await nextButton.isVisible()) {
            await nextButton.click();
          }
        }
      },

      async skipToResults(page: any) {
        // テスト用の結果ページに直接移動
        await page.goto('/test');
        await page.waitForLoadState('networkidle');
      },
    };
    await use(helper);
  },
});

export { expect } from '@playwright/test';
