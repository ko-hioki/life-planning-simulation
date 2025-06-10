import { test as base } from '@playwright/test';

/**
 * カスタムテストフィクスチャ
 * テスト間で共通に使用するヘルパー関数やデータを定義
 */
export const test = base.extend<{
  // 共通のテストデータ
  testUser: {
    name: string;
    birthYear: number;
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
  testUser: async ({ }, use) => {
    const userData = {
      name: 'テストユーザー',
      birthYear: 1993,
      monthlyIncome: 400000,
      currentAssets: 1000000,
      retirementAge: 65,
    };
    await use(userData);
  },

  // ウィザードヘルパー
  wizardHelper: async ({ }, use) => {
    const helper = {
      async fillBasicInfo(page: any, data: any) {
        // 名前入力
        const nameInput = page.locator('input').first();
        if (await nameInput.isVisible()) {
          await nameInput.fill(data.name || 'テストユーザー');
        }
        
        // 生年入力
        const birthYearInput = page.locator('input').nth(1);
        if (await birthYearInput.isVisible()) {
          await birthYearInput.fill(data.birthYear?.toString() || '1993');
        }
        
        // 退職年齢入力
        const retirementAgeInput = page.locator('input').nth(2);
        if (await retirementAgeInput.isVisible()) {
          await retirementAgeInput.fill(data.retirementAge?.toString() || '65');
        }
      },

      async completeWizard(page: any) {
        // 基本情報を入力
        await this.fillBasicInfo(page, {
          name: 'テストユーザー',
          birthYear: 1993,
          retirementAge: 65
        });
        
        // 次へボタンがある場合はクリック
        const nextButton = page.locator('text=次へ');
        if (await nextButton.isVisible()) {
          await nextButton.click();
        }
        
        // 完了ボタンがある場合はクリック
        const completeButton = page.locator('text=完了');
        if (await completeButton.isVisible()) {
          await completeButton.click();
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
