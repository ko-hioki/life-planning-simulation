import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimulationChart, SimulationStats } from '../charts';
import type { SimulationResult } from '../../types';

// ResizeObserverのモック
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// テスト用のモックデータ
const mockResults: SimulationResult[] = [
  {
    year: 2025,
    age: 30,
    income: 5000000,
    expenses: 3000000,
    educationCosts: 0,
    childAllowance: 0,
    netCashFlow: 2000000,
    cumulativeAssets: 2000000,
  },
  {
    year: 2026,
    age: 31,
    income: 5200000,
    expenses: 3100000,
    educationCosts: 0,
    childAllowance: 0,
    netCashFlow: 2100000,
    cumulativeAssets: 4100000,
  },
  {
    year: 2027,
    age: 32,
    income: 5400000,
    expenses: 3200000,
    educationCosts: 0,
    childAllowance: 0,
    netCashFlow: 2200000,
    cumulativeAssets: 6300000,
  },
];

const mockLifePlan = {
  name: 'テストプラン',
  user: {
    birthYear: 1995,
    retirementAge: 65,
  },
};

describe('Charts Components', () => {
  describe('SimulationChart', () => {
    it('should render without crashing', () => {
      render(<SimulationChart results={mockResults} />);
      
      // Rechartsのresponsive containerが存在することを確認
      const container = document.querySelector('.recharts-responsive-container') || 
                       document.querySelector('.w-full');
      expect(container).toBeInTheDocument();
    });

    it('should handle empty results gracefully', () => {
      render(<SimulationChart results={[]} />);
      
      // 空のデータでもクラッシュしないことを確認
      const container = document.querySelector('.recharts-responsive-container') || 
                       document.querySelector('.w-full');
      expect(container).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      render(
        <SimulationChart 
          results={mockResults} 
          showIncome={true}
          showExpenses={false}
          showAssets={true}
          showNetCashFlow={true}
          height={300}
        />
      );
      
      const container = document.querySelector('.recharts-responsive-container') || 
                       document.querySelector('.w-full');
      expect(container).toBeInTheDocument();
      
      // カスタム高さが適用されていることを確認
      const responsiveContainer = document.querySelector('.recharts-responsive-container');
      if (responsiveContainer) {
        expect(responsiveContainer).toHaveStyle('height: 300px');
      }
    });
  });

  describe('SimulationStats', () => {
    it('should render statistics cards', () => {
      render(<SimulationStats results={mockResults} lifePlan={mockLifePlan} />);
      
      // 統計カードの存在を確認
      expect(screen.getByText('最終資産')).toBeInTheDocument();
      expect(screen.getByText('最大資産')).toBeInTheDocument();
      expect(screen.getByText('総収入')).toBeInTheDocument();
    });

    it('should handle empty results gracefully', () => {
      render(<SimulationStats results={[]} />);
      
      // 空のデータでも基本的な要素は表示される
      expect(screen.getByText('最終資産')).toBeInTheDocument();
    });

    it('should show retirement assets when lifePlan is provided', () => {
      // 退職時資産が表示されるための適切なデータを作成
      const retirementYear = mockLifePlan.user.birthYear + mockLifePlan.user.retirementAge; // 2060年
      const resultsWithRetirement = [
        ...mockResults,
        {
          year: retirementYear,
          age: 65,
          income: 0,
          expenses: 2000000,
          educationCosts: 0,
          childAllowance: 0,
          netCashFlow: -2000000,
          cumulativeAssets: 8000000,
        }
      ];
      
      render(<SimulationStats results={resultsWithRetirement} lifePlan={mockLifePlan} />);
      
      // 退職時資産カードが表示されることを確認
      expect(screen.getByText('退職時資産')).toBeInTheDocument();
    });

    it('should display correct currency formatting', () => {
      render(<SimulationStats results={mockResults} lifePlan={mockLifePlan} />);
      
      // 通貨フォーマットの確認（万円単位）- 複数存在する場合は最初のものをチェック
      const finalAssetsElements = screen.getAllByText(/630万円/);
      expect(finalAssetsElements.length).toBeGreaterThan(0);
      expect(finalAssetsElements[0]).toBeInTheDocument();
    });
  });
});
