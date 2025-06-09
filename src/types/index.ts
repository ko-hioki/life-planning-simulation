// 基本型定義
export interface User {
  name: string;
  birthYear: number;
  retirementAge: number;
}

// ウィザード入力用の基本情報型
export interface UserInfo {
  name?: string;
  birthYear?: number;
  hasSpouse?: boolean;
  spouseBirthYear?: number;
  retirementAge?: number;
  currentSavings?: number;
}

export interface Spouse {
  name: string;
  birthYear: number;
  retirementAge: number;
  workStatus: 'working' | 'partTime' | 'notWorking';
}

export interface Child {
  id: string;
  name: string;
  birthYear: number;
  educationPath: EducationPath;
}

export interface EducationPath {
  elementary: boolean;
  juniorHigh: boolean;
  highSchool: 'public' | 'private';
  university: 'none' | 'national' | 'private';
  graduateSchool: boolean;
}

export interface Income {
  userIncome: number;
  spouseIncome: number;
  otherIncome: number;
  incomeGrowthRate: number;
}

export interface Expenses {
  livingExpenses: number;
  housingExpenses: number;
  otherExpenses: number;
  expenseGrowthRate: number;
}

export interface Assets {
  savings: number;
  investments: number;
  realEstate: number;
  other: number;
}

export interface Pension {
  nationalPension: number;
  employeePension: number;
  corporatePension: number;
  privatePension: number;
}

export interface SimulationParameters {
  simulationStartYear: number;
  simulationEndYear: number;
  inflationRate: number;
  investmentReturnRate: number;
}

export interface LifePlan {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  spouse?: Spouse;
  children: Child[];
  income: Income;
  expenses: Expenses;
  assets: Assets;
  pension: Pension;
  simulationParameters: SimulationParameters;
}

export interface SimulationResult {
  year: number;
  age: number;
  income: number;
  expenses: number;
  educationCosts: number;
  childAllowance: number;
  netCashFlow: number;
  cumulativeAssets: number;
}

export interface ComparisonData {
  planId: string;
  planName: string;
  results: SimulationResult[];
  color: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
  touched: Record<string, boolean>;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<{
    data: UserInfo | Income | Expenses | Child[] | Assets | Pension | Record<string, unknown>;
    onUpdate: (data: Record<string, unknown>) => void;
    isValid: boolean;
    onValidationChange: (isValid: boolean) => void;
  }>;
  isCompleted: boolean;
  isOptional?: boolean;
}

// 教育費データ（文部科学省データベース）
export interface EducationCostData {
  level: 'elementary' | 'juniorHigh' | 'highSchool' | 'university' | 'graduateSchool';
  type: 'public' | 'private' | 'national';
  annualCost: number;
  totalCost: number;
  year: number; // データ年度
}

// 児童手当データ
export interface ChildAllowanceData {
  ageFrom: number;
  ageTo: number;
  monthlyAmount: number;
  incomeLimit: number; // 所得制限限度額
  incomeUpperLimit: number; // 所得上限限度額
}

// PDF出力設定
export interface PDFExportOptions {
  includeCharts: boolean;
  includeDataTable: boolean;
  includeAssumptions: boolean;
  dateRange: {
    start: number;
    end: number;
  };
}

// ローカルストレージのデータ構造
export interface StorageData {
  lifePlans: LifePlan[];
  lastUpdated: Date;
  version: string;
}

// API レスポンス型（将来の拡張用）
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// コンポーネントのProps型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormFieldProps extends BaseComponentProps {
  label: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
}
