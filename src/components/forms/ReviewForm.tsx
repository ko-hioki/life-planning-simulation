import React from 'react';
import { Button, Alert, Card } from '../ui';
import type { UserInfo, Income, Expenses, Child, SimulationParameters } from '../../types';

interface ReviewFormProps {
  basicInfo: Partial<UserInfo>;
  income: Partial<Income>;
  expenses: Partial<Expenses>;
  children: Child[];
  simulationSettings: Partial<SimulationParameters>;
  onComplete: () => void;
  onPrev: () => void;
  onEdit: (step: string) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  basicInfo,
  income,
  expenses,
  children,
  simulationSettings,
  onComplete,
  onPrev,
  onEdit,
}) => {
  const formatCurrency = (value: number | undefined): string => {
    if (!value) return '0円';
    return new Intl.NumberFormat('ja-JP').format(value) + '円';
  };

  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return '0%';
    return (value * 100).toFixed(1) + '%';
  };

  const calculateCurrentAge = (birthYear: number | undefined): number => {
    if (!birthYear) return 0;
    return new Date().getFullYear() - birthYear;
  };

  const calculateRetirementYear = (birthYear: number | undefined, retirementAge: number | undefined): number => {
    if (!birthYear || !retirementAge) return 0;
    return birthYear + retirementAge;
  };

  const totalMonthlyIncome = ((income.userIncome || 0) + (income.spouseIncome || 0) + (income.otherIncome || 0)) / 12;
  const totalMonthlyExpenses = (expenses.livingExpenses || 0) + (expenses.housingExpenses || 0) + (expenses.otherExpenses || 0);
  const monthlyCashFlow = totalMonthlyIncome - totalMonthlyExpenses;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">入力内容の確認</h2>
        <p className="text-gray-600">
          入力した内容を確認し、必要に応じて修正してからライフプランを作成してください。
        </p>
      </div>

      <div className="space-y-6">
        {/* 基本情報 */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">基本情報</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit('basic-info')}
              >
                編集
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">お名前:</span>
                <span className="ml-2 font-medium">{basicInfo.name || '未入力'}</span>
              </div>
              <div>
                <span className="text-gray-600">生年:</span>
                <span className="ml-2 font-medium">
                  {basicInfo.birthYear ? `${basicInfo.birthYear}年 (現在${calculateCurrentAge(basicInfo.birthYear)}歳)` : '未入力'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">配偶者:</span>
                <span className="ml-2 font-medium">{basicInfo.hasSpouse ? 'あり' : 'なし'}</span>
              </div>
              {basicInfo.hasSpouse && basicInfo.spouseBirthYear && (
                <div>
                  <span className="text-gray-600">配偶者生年:</span>
                  <span className="ml-2 font-medium">
                    {basicInfo.spouseBirthYear}年 (現在{calculateCurrentAge(basicInfo.spouseBirthYear)}歳)
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-600">退職予定年齢:</span>
                <span className="ml-2 font-medium">
                  {basicInfo.retirementAge ? `${basicInfo.retirementAge}歳 (${calculateRetirementYear(basicInfo.birthYear, basicInfo.retirementAge)}年)` : '未入力'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">現在の貯蓄額:</span>
                <span className="ml-2 font-medium">{formatCurrency(basicInfo.currentSavings)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 収入情報 */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">収入情報</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit('income')}
              >
                編集
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">本人年収:</span>
                <span className="ml-2 font-medium">{formatCurrency(income.userIncome)}</span>
              </div>
              <div>
                <span className="text-gray-600">配偶者年収:</span>
                <span className="ml-2 font-medium">{formatCurrency(income.spouseIncome)}</span>
              </div>
              <div>
                <span className="text-gray-600">その他収入:</span>
                <span className="ml-2 font-medium">{formatCurrency(income.otherIncome)}</span>
              </div>
              <div>
                <span className="text-gray-600">収入成長率:</span>
                <span className="ml-2 font-medium">{formatPercentage(income.incomeGrowthRate)}</span>
              </div>
              <div className="md:col-span-2 pt-2 border-t">
                <span className="text-gray-600">世帯年収合計:</span>
                <span className="ml-2 font-bold text-lg text-green-600">
                  {formatCurrency((income.userIncome || 0) + (income.spouseIncome || 0) + (income.otherIncome || 0))}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* 支出情報 */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">支出情報</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit('expenses')}
              >
                編集
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">生活費:</span>
                <span className="ml-2 font-medium">{formatCurrency(expenses.livingExpenses)}/月</span>
              </div>
              <div>
                <span className="text-gray-600">住居費:</span>
                <span className="ml-2 font-medium">{formatCurrency(expenses.housingExpenses)}/月</span>
              </div>
              <div>
                <span className="text-gray-600">その他支出:</span>
                <span className="ml-2 font-medium">{formatCurrency(expenses.otherExpenses)}/月</span>
              </div>
              <div>
                <span className="text-gray-600">支出成長率:</span>
                <span className="ml-2 font-medium">{formatPercentage(expenses.expenseGrowthRate)}</span>
              </div>
              <div className="md:col-span-2 pt-2 border-t">
                <span className="text-gray-600">月間支出合計:</span>
                <span className="ml-2 font-bold text-lg text-red-600">
                  {formatCurrency(totalMonthlyExpenses)}/月
                </span>
                <span className="ml-4 text-gray-600">年間:</span>
                <span className="ml-1 font-medium">
                  {formatCurrency(totalMonthlyExpenses * 12)}/年
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* 収支バランス */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">現在の収支バランス</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 font-medium">月間収入</div>
                <div className="text-2xl font-bold text-green-800">
                  {formatCurrency(totalMonthlyIncome)}
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-red-600 font-medium">月間支出</div>
                <div className="text-2xl font-bold text-red-800">
                  {formatCurrency(totalMonthlyExpenses)}
                </div>
              </div>
              <div className={`text-center p-4 rounded-lg ${monthlyCashFlow >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                <div className={`font-medium ${monthlyCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  月間収支
                </div>
                <div className={`text-2xl font-bold ${monthlyCashFlow >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                  {monthlyCashFlow >= 0 ? '+' : ''}{formatCurrency(Math.abs(monthlyCashFlow))}
                </div>
              </div>
            </div>
            {monthlyCashFlow < 0 && (
              <Alert variant="warning" className="mt-4">
                現在の設定では月間収支がマイナスです。支出を見直すか、収入を増やすことを検討してください。
              </Alert>
            )}
          </div>
        </Card>

        {/* 子供・教育情報 */}
        {children.length > 0 && (
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">お子様の情報</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit('children')}
                >
                  編集
                </Button>
              </div>
              <div className="space-y-4">
                {children.map((child) => (
                  <div key={child.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">お名前:</span>
                        <span className="ml-2 font-medium">{child.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">生年:</span>
                        <span className="ml-2 font-medium">
                          {child.birthYear}年 (現在{calculateCurrentAge(child.birthYear)}歳)
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">高校:</span>
                        <span className="ml-2 font-medium">
                          {child.educationPath.highSchool === 'public' ? '公立' : '私立'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">大学:</span>
                        <span className="ml-2 font-medium">
                          {child.educationPath.university === 'none' ? '進学しない' : 
                           child.educationPath.university === 'national' ? '国立大学' : '私立大学'}
                          {child.educationPath.graduateSchool && ' + 大学院'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* シミュレーション設定 */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">シミュレーション設定</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit('simulation')}
              >
                編集
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">開始年:</span>
                <span className="ml-2 font-medium">{simulationSettings.simulationStartYear || '未設定'}年</span>
              </div>
              <div>
                <span className="text-gray-600">終了年:</span>
                <span className="ml-2 font-medium">{simulationSettings.simulationEndYear || '未設定'}年</span>
              </div>
              <div>
                <span className="text-gray-600">想定インフレ率:</span>
                <span className="ml-2 font-medium">{formatPercentage(simulationSettings.inflationRate)}</span>
              </div>
              <div>
                <span className="text-gray-600">想定投資リターン率:</span>
                <span className="ml-2 font-medium">{formatPercentage(simulationSettings.investmentReturnRate)}</span>
              </div>
              {simulationSettings.simulationStartYear && simulationSettings.simulationEndYear && (
                <div className="md:col-span-2 pt-2 border-t">
                  <span className="text-gray-600">シミュレーション期間:</span>
                  <span className="ml-2 font-medium">
                    {simulationSettings.simulationEndYear - simulationSettings.simulationStartYear}年間
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 確認とアクション */}
        <Alert variant="success">
          <strong>入力完了</strong><br />
          すべての項目が入力されました。「ライフプランを作成」ボタンをクリックして、
          あなた専用のライフプランシミュレーションを開始してください。
        </Alert>

        {/* ボタン */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onPrev}
          >
            前へ
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onComplete}
            className="px-8"
          >
            ライフプランを作成
          </Button>
        </div>
      </div>
    </div>
  );
};
