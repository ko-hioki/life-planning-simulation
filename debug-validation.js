import { validateIncome } from '../src/utils/validation';
import type { Income } from '../src/types';

// テスト用の収入データ
const testIncomeData: Partial<Income> = {
  userIncome: 5000000, // 本人年収（必須）
  spouseIncome: 0,     // 配偶者年収（任意）
  otherIncome: 0,      // その他収入（任意）
  // incomeGrowthRate は未設定（任意）
};

// バリデーション実行
const errors = validateIncome(testIncomeData);

console.log('テストデータ:', testIncomeData);
console.log('バリデーション結果:', errors);
console.log('エラー数:', errors.length);
console.log('バリデーション成功:', errors.length === 0);

// 収入成長率が未設定でもバリデーションが通るかテスト
const testIncomeDataWithGrowthRate: Partial<Income> = {
  ...testIncomeData,
  incomeGrowthRate: 0.02, // 2%
};

const errorsWithGrowthRate = validateIncome(testIncomeDataWithGrowthRate);
console.log('\n成長率ありテストデータ:', testIncomeDataWithGrowthRate);
console.log('バリデーション結果:', errorsWithGrowthRate);
console.log('エラー数:', errorsWithGrowthRate.length);
console.log('バリデーション成功:', errorsWithGrowthRate.length === 0);
