import type { LifePlan, SimulationResult } from '../types';
import { calculateChildEducationCostByYear, calculateAnnualChildAllowance } from '../data/educationData';

/**
 * ライフプランシミュレーション計算エンジン
 */
export class LifePlanSimulator {
  private lifePlan: LifePlan;

  constructor(lifePlan: LifePlan) {
    this.lifePlan = lifePlan;
  }

  /**
   * 指定期間のシミュレーション結果を計算
   */
  simulate(): SimulationResult[] {
    const results: SimulationResult[] = [];
    const { simulationStartYear, simulationEndYear } = this.lifePlan.simulationParameters;

    for (let year = simulationStartYear; year <= simulationEndYear; year++) {
      const result = this.calculateYearlyResult(year);
      results.push(result);
    }

    return this.calculateCumulativeAssets(results);
  }

  /**
   * 指定年の結果を計算
   */
  private calculateYearlyResult(year: number): SimulationResult {
    const userAge = year - this.lifePlan.user.birthYear;
    const income = this.calculateIncome(year);
    const expenses = this.calculateExpenses(year);
    const educationCosts = this.calculateEducationCosts(year);
    const childAllowance = this.calculateChildAllowance(year);

    return {
      year,
      age: userAge,
      income,
      expenses,
      educationCosts,
      childAllowance,
      netCashFlow: income - expenses - educationCosts + childAllowance,
      cumulativeAssets: 0, // 後で計算
    };
  }

  /**
   * 収入計算
   */
  private calculateIncome(year: number): number {
    const baseYear = this.lifePlan.simulationParameters.simulationStartYear;
    const yearsElapsed = year - baseYear;
    const growthRate = this.lifePlan.income.incomeGrowthRate / 100;

    const userAge = year - this.lifePlan.user.birthYear;
    const spouseAge = this.lifePlan.spouse ? year - this.lifePlan.spouse.birthYear : 0;

    let totalIncome = 0;

    // ユーザー収入（退職年齢まで）
    if (userAge <= this.lifePlan.user.retirementAge) {
      totalIncome += this.lifePlan.income.userIncome * Math.pow(1 + growthRate, yearsElapsed);
    }

    // 配偶者収入（存在し、退職年齢まで）
    if (this.lifePlan.spouse && spouseAge <= this.lifePlan.spouse.retirementAge) {
      const spouseIncomeRate = this.getSpouseIncomeRate(this.lifePlan.spouse.workStatus);
      totalIncome += this.lifePlan.income.spouseIncome * spouseIncomeRate * Math.pow(1 + growthRate, yearsElapsed);
    }

    // その他収入
    totalIncome += this.lifePlan.income.otherIncome * Math.pow(1 + growthRate, yearsElapsed);

    // 年金収入（退職後）
    if (userAge > this.lifePlan.user.retirementAge) {
      totalIncome += this.calculatePensionIncome(year);
    }

    return Math.round(totalIncome);
  }

  /**
   * 配偶者の勤務状況による収入倍率を取得
   */
  private getSpouseIncomeRate(workStatus: string): number {
    switch (workStatus) {
      case 'working':
        return 1.0;
      case 'partTime':
        return 0.5;
      case 'notWorking':
        return 0.0;
      default:
        return 0.0;
    }
  }

  /**
   * 年金収入計算
   */
  private calculatePensionIncome(year: number): number {
    const userAge = year - this.lifePlan.user.birthYear;
    
    // 65歳から年金受給開始と仮定
    if (userAge < 65) return 0;

    const { nationalPension, employeePension, corporatePension, privatePension } = this.lifePlan.pension;
    return nationalPension + employeePension + corporatePension + privatePension;
  }

  /**
   * 支出計算
   */
  private calculateExpenses(year: number): number {
    const baseYear = this.lifePlan.simulationParameters.simulationStartYear;
    const yearsElapsed = year - baseYear;
    const growthRate = this.lifePlan.expenses.expenseGrowthRate / 100;
    const inflationRate = this.lifePlan.simulationParameters.inflationRate / 100;

    const totalGrowthRate = growthRate + inflationRate;
    const multiplier = Math.pow(1 + totalGrowthRate, yearsElapsed);

    const livingExpenses = this.lifePlan.expenses.livingExpenses * multiplier;
    const housingExpenses = this.lifePlan.expenses.housingExpenses * multiplier;
    const otherExpenses = this.lifePlan.expenses.otherExpenses * multiplier;

    return Math.round(livingExpenses + housingExpenses + otherExpenses);
  }

  /**
   * 教育費計算
   */
  private calculateEducationCosts(year: number): number {
    return this.lifePlan.children.reduce((total, child) => {
      return total + calculateChildEducationCostByYear(child, year);
    }, 0);
  }

  /**
   * 児童手当計算
   */
  private calculateChildAllowance(year: number): number {
    const eligibleChildren = this.lifePlan.children
      .map((child, index) => ({
        age: year - child.birthYear,
        order: index + 1,
      }))
      .filter(child => child.age >= 0 && child.age <= 14);

    const totalIncome = this.calculateIncome(year);
    return calculateAnnualChildAllowance(eligibleChildren, totalIncome);
  }

  /**
   * 累積資産計算
   */
  private calculateCumulativeAssets(results: SimulationResult[]): SimulationResult[] {
    let cumulativeAssets = this.getTotalInitialAssets();

    return results.map(result => {
      cumulativeAssets += result.netCashFlow;
      
      // 投資収益を加算
      if (cumulativeAssets > 0) {
        const investmentReturn = cumulativeAssets * (this.lifePlan.simulationParameters.investmentReturnRate / 100);
        cumulativeAssets += investmentReturn;
      }

      return {
        ...result,
        cumulativeAssets: Math.round(cumulativeAssets),
      };
    });
  }

  /**
   * 初期資産合計を取得
   */
  private getTotalInitialAssets(): number {
    const { savings, investments, realEstate, other } = this.lifePlan.assets;
    return savings + investments + realEstate + other;
  }
}

/**
 * 複数のライフプランを比較するためのユーティリティ
 */
export class LifePlanComparator {
  private lifePlans: LifePlan[];

  constructor(lifePlans: LifePlan[]) {
    this.lifePlans = lifePlans;
  }

  /**
   * 全プランのシミュレーション結果を取得
   */
  compareAll(): Array<{ plan: LifePlan; results: SimulationResult[] }> {
    return this.lifePlans.map(plan => ({
      plan,
      results: new LifePlanSimulator(plan).simulate(),
    }));
  }

  /**
   * 指定年での資産比較
   */
  compareAssetsAtYear(year: number): Array<{ planName: string; assets: number }> {
    const comparisons = this.compareAll();
    
    return comparisons.map(({ plan, results }) => {
      const yearResult = results.find(r => r.year === year);
      return {
        planName: plan.name,
        assets: yearResult?.cumulativeAssets || 0,
      };
    });
  }

  /**
   * 退職時資産比較
   */
  compareRetirementAssets(): Array<{ planName: string; assets: number; retirementYear: number }> {
    const comparisons = this.compareAll();
    
    return comparisons.map(({ plan, results }) => {
      const retirementYear = plan.user.birthYear + plan.user.retirementAge;
      const retirementResult = results.find(r => r.year === retirementYear);
      
      return {
        planName: plan.name,
        assets: retirementResult?.cumulativeAssets || 0,
        retirementYear,
      };
    });
  }

  /**
   * 最大資産到達年を比較
   */
  comparePeakAssets(): Array<{ planName: string; peakAssets: number; peakYear: number }> {
    const comparisons = this.compareAll();
    
    return comparisons.map(({ plan, results }) => {
      const peakResult = results.reduce((max, current) => 
        current.cumulativeAssets > max.cumulativeAssets ? current : max
      );
      
      return {
        planName: plan.name,
        peakAssets: peakResult.cumulativeAssets,
        peakYear: peakResult.year,
      };
    });
  }
}

/**
 * シミュレーション結果の統計情報を計算
 */
export const calculateStatistics = (results: SimulationResult[]) => {
  const totalIncome = results.reduce((sum, r) => sum + r.income, 0);
  const totalExpenses = results.reduce((sum, r) => sum + r.expenses, 0);
  const totalEducationCosts = results.reduce((sum, r) => sum + r.educationCosts, 0);
  const totalChildAllowance = results.reduce((sum, r) => sum + r.childAllowance, 0);
  
  const finalAssets = results[results.length - 1]?.cumulativeAssets || 0;
  const peakAssets = Math.max(...results.map(r => r.cumulativeAssets));
  const minAssets = Math.min(...results.map(r => r.cumulativeAssets));
  
  const negativeYears = results.filter(r => r.cumulativeAssets < 0).length;
  
  return {
    totalIncome,
    totalExpenses,
    totalEducationCosts,
    totalChildAllowance,
    finalAssets,
    peakAssets,
    minAssets,
    negativeYears,
    simulationYears: results.length,
  };
};
