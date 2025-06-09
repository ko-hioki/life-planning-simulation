import type { EducationCostData, ChildAllowanceData } from '../types';

// 文部科学省「子供の学習費調査」（令和3年度）およびその他公的データに基づく教育費
export const educationCosts: EducationCostData[] = [
  // 小学校（6年間）
  {
    level: 'elementary',
    type: 'public',
    annualCost: 352566, // 公立小学校年間費用
    totalCost: 2115396, // 6年間総額
    year: 2021,
  },
  {
    level: 'elementary',
    type: 'private',
    annualCost: 1666949, // 私立小学校年間費用
    totalCost: 10001694, // 6年間総額
    year: 2021,
  },
  
  // 中学校（3年間）
  {
    level: 'juniorHigh',
    type: 'public',
    annualCost: 538799, // 公立中学校年間費用
    totalCost: 1616397, // 3年間総額
    year: 2021,
  },
  {
    level: 'juniorHigh',
    type: 'private',
    annualCost: 1436353, // 私立中学校年間費用
    totalCost: 4309059, // 3年間総額
    year: 2021,
  },
  
  // 高等学校（3年間）
  {
    level: 'highSchool',
    type: 'public',
    annualCost: 512971, // 公立高等学校年間費用
    totalCost: 1538913, // 3年間総額
    year: 2021,
  },
  {
    level: 'highSchool',
    type: 'private',
    annualCost: 1054444, // 私立高等学校年間費用
    totalCost: 3163332, // 3年間総額
    year: 2021,
  },
  
  // 大学（4年間）- 文部科学省「国公私立大学の授業料等の推移」等より
  {
    level: 'university',
    type: 'national',
    annualCost: 817800, // 国立大学年間費用（授業料+入学金等）
    totalCost: 3271200, // 4年間総額
    year: 2023,
  },
  {
    level: 'university',
    type: 'public',
    annualCost: 935000, // 公立大学年間費用（平均）
    totalCost: 3740000, // 4年間総額
    year: 2023,
  },
  {
    level: 'university',
    type: 'private',
    annualCost: 1542000, // 私立大学年間費用（平均）
    totalCost: 6168000, // 4年間総額
    year: 2023,
  },
  
  // 大学院（修士2年間）
  {
    level: 'graduateSchool',
    type: 'national',
    annualCost: 817800, // 国立大学院年間費用
    totalCost: 1635600, // 2年間総額
    year: 2023,
  },
  {
    level: 'graduateSchool',
    type: 'private',
    annualCost: 1200000, // 私立大学院年間費用（平均）
    totalCost: 2400000, // 2年間総額
    year: 2023,
  },
];

// 児童手当制度（令和4年6月分から適用）
export const childAllowanceData: ChildAllowanceData[] = [
  {
    ageFrom: 0,
    ageTo: 2, // 3歳未満
    monthlyAmount: 15000,
    incomeLimit: 8330000, // 所得制限限度額（年収ベース概算）
    incomeUpperLimit: 12000000, // 所得上限限度額（年収ベース概算）
  },
  {
    ageFrom: 3,
    ageTo: 11, // 3歳以上小学校修了前（第1子・第2子）
    monthlyAmount: 10000,
    incomeLimit: 8330000,
    incomeUpperLimit: 12000000,
  },
  {
    ageFrom: 3,
    ageTo: 11, // 3歳以上小学校修了前（第3子以降）
    monthlyAmount: 15000,
    incomeLimit: 8330000,
    incomeUpperLimit: 12000000,
  },
  {
    ageFrom: 12,
    ageTo: 14, // 中学生
    monthlyAmount: 10000,
    incomeLimit: 8330000,
    incomeUpperLimit: 12000000,
  },
];

// 教育費計算ヘルパー関数
export const calculateEducationCost = (
  level: EducationCostData['level'],
  type: EducationCostData['type'],
  isAnnual: boolean = false
): number => {
  const cost = educationCosts.find(c => c.level === level && c.type === type);
  if (!cost) return 0;
  return isAnnual ? cost.annualCost : cost.totalCost;
};

// 児童手当計算ヘルパー関数
export const calculateChildAllowance = (
  childAge: number,
  childOrder: number, // 第何子か（1から始まる）
  parentIncome: number
): number => {
  // 所得上限限度額を超える場合は支給なし
  if (parentIncome > 12000000) return 0;
  
  // 所得制限限度額を超える場合は特例給付（月額5,000円）
  if (parentIncome > 8330000) return 5000;
  
  // 通常の支給額
  if (childAge < 3) return 15000;
  if (childAge >= 3 && childAge <= 11) {
    return childOrder >= 3 ? 15000 : 10000;
  }
  if (childAge >= 12 && childAge <= 14) return 10000;
  
  return 0; // 15歳以上は支給なし
};

// 年間児童手当総額計算
export const calculateAnnualChildAllowance = (
  children: Array<{ age: number; order: number }>,
  parentIncome: number
): number => {
  return children.reduce((total, child) => {
    const monthlyAmount = calculateChildAllowance(child.age, child.order, parentIncome);
    return total + (monthlyAmount * 12);
  }, 0);
};

// 教育段階の期間情報
export const educationPeriods = {
  elementary: { years: 6, startAge: 6 },
  juniorHigh: { years: 3, startAge: 12 },
  highSchool: { years: 3, startAge: 15 },
  university: { years: 4, startAge: 18 },
  graduateSchool: { years: 2, startAge: 22 },
} as const;

// 子どもの教育費年次計算
export const calculateChildEducationCostByYear = (
  child: { birthYear: number; educationPath: import('../types').EducationPath },
  targetYear: number
): number => {
  const childAge = targetYear - child.birthYear;
  const { educationPath } = child;
  
  // 小学校
  if (childAge >= 6 && childAge <= 11) {
    return calculateEducationCost('elementary', 'public', true);
  }
  
  // 中学校
  if (childAge >= 12 && childAge <= 14) {
    return calculateEducationCost('juniorHigh', 'public', true);
  }
  
  // 高校
  if (childAge >= 15 && childAge <= 17) {
    return calculateEducationCost('highSchool', educationPath.highSchool, true);
  }
  
  // 大学
  if (childAge >= 18 && childAge <= 21 && educationPath.university !== 'none') {
    return calculateEducationCost('university', educationPath.university, true);
  }
  
  // 大学院
  if (childAge >= 22 && childAge <= 23 && educationPath.graduateSchool) {
    return calculateEducationCost('graduateSchool', 'national', true);
  }
  
  return 0;
};
