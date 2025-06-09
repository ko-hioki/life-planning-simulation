// テスト用のライフプランデータ生成ツール
import type { LifePlan } from '../types';

export const createTestLifePlan = (): LifePlan => {
  const currentYear = new Date().getFullYear();
  
  return {
    id: 'test-plan-001',
    name: 'テスト用プラン',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      name: 'テスト太郎',
      birthYear: 1990,
      retirementAge: 65,
    },
    spouse: {
      name: 'テスト花子',
      birthYear: 1992,
      retirementAge: 65,
      workStatus: 'working',
    },
    children: [
      {
        id: 'child-1',
        name: '子供1',
        birthYear: 2020,
        educationPath: {
          elementary: true,
          juniorHigh: true,
          highSchool: 'public',
          university: 'national',
          graduateSchool: false,
        },
      },
      {
        id: 'child-2',
        name: '子供2',
        birthYear: 2022,
        educationPath: {
          elementary: true,
          juniorHigh: true,
          highSchool: 'public',
          university: 'private',
          graduateSchool: false,
        },
      },
    ],
    income: {
      userIncome: 6000000, // 600万円
      spouseIncome: 4000000, // 400万円
      otherIncome: 0,
      incomeGrowthRate: 2, // 2%
    },
    expenses: {
      livingExpenses: 3000000, // 300万円
      housingExpenses: 1500000, // 150万円
      otherExpenses: 500000, // 50万円
      expenseGrowthRate: 1, // 1%
    },
    assets: {
      savings: 5000000, // 500万円
      investments: 2000000, // 200万円
      realEstate: 0,
      other: 0,
    },
    pension: {
      nationalPension: 780000, // 年額78万円
      employeePension: 1200000, // 年額120万円
      corporatePension: 0,
      privatePension: 0,
    },
    simulationParameters: {
      simulationStartYear: currentYear,
      simulationEndYear: currentYear + 50, // 50年間
      inflationRate: 1, // 1%
      investmentReturnRate: 3, // 3%
    },
  };
};

// テスト実行用関数
export const testSimulation = () => {
  console.log('=== シミュレーションテスト開始 ===');
  
  const testPlan = createTestLifePlan();
  console.log('テストプラン:', testPlan);
  
  // ここでシミュレーション実行をテスト
  try {
    const { LifePlanSimulator } = require('../utils/simulator');
    const simulator = new LifePlanSimulator(testPlan);
    const results = simulator.simulate();
    
    console.log('シミュレーション結果:', results);
    console.log('結果件数:', results.length);
    
    if (results.length > 0) {
      console.log('最初の年:', results[0]);
      console.log('最後の年:', results[results.length - 1]);
      
      // 統計も計算
      const { calculateStatistics } = require('../utils/simulator');
      const stats = calculateStatistics(results);
      console.log('統計情報:', stats);
    }
  } catch (error) {
    console.error('シミュレーションエラー:', error);
  }
  
  console.log('=== シミュレーションテスト終了 ===');
};
