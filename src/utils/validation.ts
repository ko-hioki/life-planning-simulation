import type { LifePlan, ValidationError, User, Spouse, Child, Income, Expenses, Assets, Pension, SimulationParameters, UserInfo } from '../types';

/**
 * フォームバリデーション管理クラス
 */
export class Validator {
  private errors: ValidationError[] = [];

  /**
   * エラーをクリア
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * エラーを追加
   */
  addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  /**
   * エラー一覧を取得
   */
  getErrors(): ValidationError[] {
    return this.errors;
  }

  /**
   * 特定フィールドのエラーを取得
   */
  getFieldError(field: string): string | undefined {
    return this.errors.find(e => e.field === field)?.message;
  }

  /**
   * バリデーション結果が有効かチェック
   */
  isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * 必須フィールドチェック
   */
  required(field: string, value: any, label: string): void {
    if (value === null || value === undefined || value === '') {
      this.addError(field, `${label}は必須項目です`);
    }
  }

  /**
   * 数値範囲チェック
   */
  numberRange(field: string, value: number, min: number, max: number, label: string): void {
    if (value < min || value > max) {
      this.addError(field, `${label}は${min}以上${max}以下で入力してください`);
    }
  }

  /**
   * 正の数チェック
   */
  positive(field: string, value: number, label: string): void {
    if (value < 0) {
      this.addError(field, `${label}は0以上で入力してください`);
    }
  }

  /**
   * 年齢妥当性チェック
   */
  age(field: string, birthYear: number, label: string): void {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    if (age < 0 || age > 120) {
      this.addError(field, `${label}の年齢が不正です（生年: ${birthYear}）`);
    }
  }

  /**
   * 日付範囲チェック
   */
  dateRange(field: string, startYear: number, endYear: number, label: string): void {
    if (startYear >= endYear) {
      this.addError(field, `${label}の開始年は終了年より前である必要があります`);
    }
  }

  /**
   * 文字列長チェック
   */
  stringLength(field: string, value: string, maxLength: number, label: string): void {
    if (value && value.length > maxLength) {
      this.addError(field, `${label}は${maxLength}文字以下で入力してください`);
    }
  }

  /**
   * メールアドレス形式チェック
   */
  email(field: string, value: string, label: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      this.addError(field, `${label}の形式が正しくありません`);
    }
  }
}

/**
 * ユーザー情報バリデーション
 */
export const validateUser = (user: Partial<User>): ValidationError[] => {
  const validator = new Validator();
  const currentYear = new Date().getFullYear();

  validator.required('name', user.name, '名前');
  validator.stringLength('name', user.name || '', 50, '名前');

  validator.required('birthYear', user.birthYear, '生年');
  if (user.birthYear) {
    validator.numberRange('birthYear', user.birthYear, currentYear - 100, currentYear, '生年');
  }

  validator.required('retirementAge', user.retirementAge, '退職予定年齢');
  if (user.retirementAge) {
    validator.numberRange('retirementAge', user.retirementAge, 50, 80, '退職予定年齢');
  }

  return validator.getErrors();
};

/**
 * 配偶者情報バリデーション
 */
export const validateSpouse = (spouse: Partial<Spouse> | undefined): ValidationError[] => {
  if (!spouse) return [];

  const validator = new Validator();
  const currentYear = new Date().getFullYear();

  validator.required('name', spouse.name, '配偶者名');
  validator.stringLength('name', spouse.name || '', 50, '配偶者名');

  validator.required('birthYear', spouse.birthYear, '配偶者生年');
  if (spouse.birthYear) {
    validator.numberRange('birthYear', spouse.birthYear, currentYear - 100, currentYear, '配偶者生年');
  }

  validator.required('retirementAge', spouse.retirementAge, '配偶者退職予定年齢');
  if (spouse.retirementAge) {
    validator.numberRange('retirementAge', spouse.retirementAge, 50, 80, '配偶者退職予定年齢');
  }

  validator.required('workStatus', spouse.workStatus, '配偶者勤務状況');

  return validator.getErrors();
};

/**
 * 子ども情報バリデーション
 */
export const validateChild = (child: Partial<Child>, index: number): ValidationError[] => {
  const validator = new Validator();
  const currentYear = new Date().getFullYear();
  const prefix = `children.${index}`;

  validator.required(`${prefix}.name`, child.name, `子ども${index + 1}の名前`);
  validator.stringLength(`${prefix}.name`, child.name || '', 50, `子ども${index + 1}の名前`);

  validator.required(`${prefix}.birthYear`, child.birthYear, `子ども${index + 1}の生年`);
  if (child.birthYear) {
    validator.numberRange(`${prefix}.birthYear`, child.birthYear, currentYear - 25, currentYear + 10, `子ども${index + 1}の生年`);
  }

  if (child.educationPath) {
    validator.required(`${prefix}.educationPath.highSchool`, child.educationPath.highSchool, `子ども${index + 1}の高校種別`);
    validator.required(`${prefix}.educationPath.university`, child.educationPath.university, `子ども${index + 1}の大学種別`);
  }

  return validator.getErrors();
};

/**
 * 収入情報バリデーション
 */
export const validateIncome = (income: Partial<Income>): ValidationError[] => {
  const validator = new Validator();

  validator.required('userIncome', income.userIncome, '年収');
  if (income.userIncome !== undefined) {
    validator.positive('userIncome', income.userIncome, '年収');
    validator.numberRange('userIncome', income.userIncome, 0, 100000000, '年収');
  }

  if (income.spouseIncome !== undefined) {
    validator.positive('spouseIncome', income.spouseIncome, '配偶者年収');
    validator.numberRange('spouseIncome', income.spouseIncome, 0, 100000000, '配偶者年収');
  }

  if (income.otherIncome !== undefined) {
    validator.positive('otherIncome', income.otherIncome, 'その他収入');
    validator.numberRange('otherIncome', income.otherIncome, 0, 100000000, 'その他収入');
  }

  if (income.incomeGrowthRate !== undefined) {
    validator.numberRange('incomeGrowthRate', income.incomeGrowthRate, -10, 20, '収入成長率');
  }

  return validator.getErrors();
};

/**
 * 支出情報バリデーション
 */
export const validateExpenses = (expenses: Partial<Expenses>): ValidationError[] => {
  const validator = new Validator();

  validator.required('livingExpenses', expenses.livingExpenses, '生活費');
  if (expenses.livingExpenses !== undefined) {
    validator.positive('livingExpenses', expenses.livingExpenses, '生活費');
    validator.numberRange('livingExpenses', expenses.livingExpenses, 0, 50000000, '生活費');
  }

  validator.required('housingExpenses', expenses.housingExpenses, '住居費');
  if (expenses.housingExpenses !== undefined) {
    validator.positive('housingExpenses', expenses.housingExpenses, '住居費');
    validator.numberRange('housingExpenses', expenses.housingExpenses, 0, 20000000, '住居費');
  }

  if (expenses.otherExpenses !== undefined) {
    validator.positive('otherExpenses', expenses.otherExpenses, 'その他支出');
    validator.numberRange('otherExpenses', expenses.otherExpenses, 0, 50000000, 'その他支出');
  }

  if (expenses.expenseGrowthRate !== undefined) {
    validator.numberRange('expenseGrowthRate', expenses.expenseGrowthRate, -10, 20, '支出成長率');
  }

  return validator.getErrors();
};

/**
 * 資産情報バリデーション
 */
export const validateAssets = (assets: Partial<Assets>): ValidationError[] => {
  const validator = new Validator();

  if (assets.savings !== undefined) {
    validator.positive('savings', assets.savings, '預貯金');
    validator.numberRange('savings', assets.savings, 0, 1000000000, '預貯金');
  }

  if (assets.investments !== undefined) {
    validator.positive('investments', assets.investments, '投資資産');
    validator.numberRange('investments', assets.investments, 0, 1000000000, '投資資産');
  }

  if (assets.realEstate !== undefined) {
    validator.positive('realEstate', assets.realEstate, '不動産');
    validator.numberRange('realEstate', assets.realEstate, 0, 1000000000, '不動産');
  }

  if (assets.other !== undefined) {
    validator.positive('other', assets.other, 'その他資産');
    validator.numberRange('other', assets.other, 0, 1000000000, 'その他資産');
  }

  return validator.getErrors();
};

/**
 * 年金情報バリデーション
 */
export const validatePension = (pension: Partial<Pension>): ValidationError[] => {
  const validator = new Validator();

  if (pension.nationalPension !== undefined) {
    validator.positive('nationalPension', pension.nationalPension, '国民年金');
    validator.numberRange('nationalPension', pension.nationalPension, 0, 10000000, '国民年金');
  }

  if (pension.employeePension !== undefined) {
    validator.positive('employeePension', pension.employeePension, '厚生年金');
    validator.numberRange('employeePension', pension.employeePension, 0, 20000000, '厚生年金');
  }

  if (pension.corporatePension !== undefined) {
    validator.positive('corporatePension', pension.corporatePension, '企業年金');
    validator.numberRange('corporatePension', pension.corporatePension, 0, 20000000, '企業年金');
  }

  if (pension.privatePension !== undefined) {
    validator.positive('privatePension', pension.privatePension, '個人年金');
    validator.numberRange('privatePension', pension.privatePension, 0, 20000000, '個人年金');
  }

  return validator.getErrors();
};

/**
 * シミュレーション設定バリデーション
 */
export const validateSimulationParameters = (params: Partial<SimulationParameters>): ValidationError[] => {
  const validator = new Validator();
  const currentYear = new Date().getFullYear();

  validator.required('simulationStartYear', params.simulationStartYear, 'シミュレーション開始年');
  if (params.simulationStartYear) {
    validator.numberRange('simulationStartYear', params.simulationStartYear, currentYear - 5, currentYear + 5, 'シミュレーション開始年');
  }

  validator.required('simulationEndYear', params.simulationEndYear, 'シミュレーション終了年');
  if (params.simulationEndYear) {
    validator.numberRange('simulationEndYear', params.simulationEndYear, currentYear, currentYear + 100, 'シミュレーション終了年');
  }

  if (params.simulationStartYear && params.simulationEndYear) {
    validator.dateRange('simulationYears', params.simulationStartYear, params.simulationEndYear, 'シミュレーション期間');
  }

  if (params.inflationRate !== undefined) {
    validator.numberRange('inflationRate', params.inflationRate, -5, 10, 'インフレ率');
  }

  if (params.investmentReturnRate !== undefined) {
    validator.numberRange('investmentReturnRate', params.investmentReturnRate, -10, 20, '投資収益率');
  }

  return validator.getErrors();
};

/**
 * 基本情報バリデーション
 */
export function validateBasicInfo(data: Partial<UserInfo>): Record<string, string> {
  const validator = new Validator();
  const errors: Record<string, string> = {};

  // 名前
  validator.required('name', data.name, '名前');
  if (data.name) {
    validator.stringLength('name', data.name, 50, '名前');
  }
  
  // 生年
  validator.required('birthYear', data.birthYear, '生年');
  if (data.birthYear) {
    const currentYear = new Date().getFullYear();
    validator.numberRange('birthYear', data.birthYear, currentYear - 100, currentYear - 18, '生年');
  }

  // 配偶者の有無
  if (data.hasSpouse === undefined) {
    validator.addError('hasSpouse', '配偶者の有無を選択してください');
  }

  // 配偶者の生年（配偶者ありの場合）
  if (data.hasSpouse && !data.spouseBirthYear) {
    validator.addError('spouseBirthYear', '配偶者の生年は必須項目です');
  }
  if (data.hasSpouse && data.spouseBirthYear) {
    const currentYear = new Date().getFullYear();
    validator.numberRange('spouseBirthYear', data.spouseBirthYear, currentYear - 100, currentYear - 18, '配偶者の生年');
  }

  // 退職予定年齢
  validator.required('retirementAge', data.retirementAge, '退職予定年齢');
  if (data.retirementAge) {
    validator.numberRange('retirementAge', data.retirementAge, 50, 95, '退職予定年齢');
  }

  // 現在の貯蓄額
  if (data.currentSavings !== undefined) {
    validator.positive('currentSavings', data.currentSavings, '現在の貯蓄額');
  }

  // エラーを辞書形式に変換
  validator.getErrors().forEach(error => {
    errors[error.field] = error.message;
  });

  return errors;
}

/**
 * ライフプラン全体のバリデーション
 */
export const validateLifePlan = (lifePlan: Partial<LifePlan>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // 基本情報
  if (!lifePlan.name || lifePlan.name.trim() === '') {
    errors.push({ field: 'name', message: 'プラン名は必須です' });
  }

  // 各セクションのバリデーション
  if (lifePlan.user) {
    errors.push(...validateUser(lifePlan.user));
  } else {
    errors.push({ field: 'user', message: 'ユーザー情報は必須です' });
  }

  if (lifePlan.spouse) {
    errors.push(...validateSpouse(lifePlan.spouse));
  }

  if (lifePlan.children) {
    lifePlan.children.forEach((child, index) => {
      errors.push(...validateChild(child, index));
    });
  }

  if (lifePlan.income) {
    errors.push(...validateIncome(lifePlan.income));
  } else {
    errors.push({ field: 'income', message: '収入情報は必須です' });
  }

  if (lifePlan.expenses) {
    errors.push(...validateExpenses(lifePlan.expenses));
  } else {
    errors.push({ field: 'expenses', message: '支出情報は必須です' });
  }

  if (lifePlan.assets) {
    errors.push(...validateAssets(lifePlan.assets));
  }

  if (lifePlan.pension) {
    errors.push(...validatePension(lifePlan.pension));
  }

  if (lifePlan.simulationParameters) {
    errors.push(...validateSimulationParameters(lifePlan.simulationParameters));
  } else {
    errors.push({ field: 'simulationParameters', message: 'シミュレーション設定は必須です' });
  }

  return errors;
};
