import React from 'react';
import { Input, Select, Button, Alert } from '../ui';
import { useFormValidation } from '../../hooks';
import { validateExpenses } from '../../utils/validation';
import type { Expenses, ValidationError } from '../../types';

interface ExpenseInfoFormProps {
  data: Partial<Expenses>;
  onUpdate: (data: Partial<Expenses>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ExpenseInfoForm: React.FC<ExpenseInfoFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  // バリデーション関数をフック用に変換
  const validateExpenseForm = (formData: Partial<Expenses>): Record<string, string> => {
    const validationErrors = validateExpenses(formData);
    return validationErrors.reduce((acc: Record<string, string>, error: ValidationError) => {
      acc[error.field] = error.message;
      return acc;
    }, {});
  };

  const { errors, isValid, validate } = useFormValidation(
    data,
    validateExpenseForm
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof Expenses, value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    const updatedData = { ...data, [field]: numValue };
    onUpdate(updatedData);
    validate(updatedData);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ja-JP').format(value);
  };

  const calculateMonthlyTotal = (): number => {
    return (data.livingExpenses || 0) + (data.housingExpenses || 0) + (data.otherExpenses || 0);
  };

  const calculateAnnualTotal = (): number => {
    return calculateMonthlyTotal() * 12;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">支出情報</h2>
        <p className="text-gray-600">
          月々の支出を項目別に入力してください。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 生活費 */}
        <div>
          <label className="form-label form-label-required">
            生活費（月額）
          </label>
          <Input
            type="number"
            value={data.livingExpenses || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleInputChange('livingExpenses', e.target.value)
            }
            placeholder="200000"
            min="0"
            step="1000"
            error={errors.livingExpenses}
            className={errors.livingExpenses ? 'form-input-error' : ''}
          />
          <p className="text-sm text-gray-500 mt-1">
            単位：円 
            {data.livingExpenses ? ` (${formatCurrency(data.livingExpenses)}円/月)` : ''}
            <br />
            食費、日用品、交通費、通信費、医療費、保険料など
          </p>
          {errors.livingExpenses && (
            <p className="form-error">{errors.livingExpenses}</p>
          )}
        </div>

        {/* 住居費 */}
        <div>
          <label className="form-label form-label-required">
            住居費（月額）
          </label>
          <Input
            type="number"
            value={data.housingExpenses || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleInputChange('housingExpenses', e.target.value)
            }
            placeholder="100000"
            min="0"
            step="1000"
            error={errors.housingExpenses}
            className={errors.housingExpenses ? 'form-input-error' : ''}
          />
          <p className="text-sm text-gray-500 mt-1">
            単位：円 
            {data.housingExpenses ? ` (${formatCurrency(data.housingExpenses)}円/月)` : ''}
            <br />
            家賃・住宅ローン、管理費、修繕積立金、固定資産税など
          </p>
          {errors.housingExpenses && (
            <p className="form-error">{errors.housingExpenses}</p>
          )}
        </div>

        {/* その他の支出 */}
        <div>
          <label className="form-label">
            その他の支出（月額）
          </label>
          <Input
            type="number"
            value={data.otherExpenses || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleInputChange('otherExpenses', e.target.value)
            }
            placeholder="50000"
            min="0"
            step="1000"
            error={errors.otherExpenses}
            className={errors.otherExpenses ? 'form-input-error' : ''}
          />
          <p className="text-sm text-gray-500 mt-1">
            単位：円 
            {data.otherExpenses ? ` (${formatCurrency(data.otherExpenses)}円/月)` : ''}
            <br />
            娯楽費、趣味、旅行、その他の個人的な支出
          </p>
          {errors.otherExpenses && (
            <p className="form-error">{errors.otherExpenses}</p>
          )}
        </div>

        {/* 支出成長率 */}
        <div>
          <label className="form-label">
            支出成長率
          </label>
          <Select
            value={data.expenseGrowthRate?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleInputChange('expenseGrowthRate', parseFloat(e.target.value))
            }
            error={errors.expenseGrowthRate}
          >
            <option value="">成長率を選択してください</option>
            <option value="0">0% (支出変化なし)</option>
            <option value="0.01">1% (低インフレ)</option>
            <option value="0.02">2% (標準的なインフレ)</option>
            <option value="0.03">3% (高インフレ)</option>
            <option value="-0.01">-1% (支出削減)</option>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            インフレ率やライフスタイルの変化を考慮した年平均の支出成長率
          </p>
          {errors.expenseGrowthRate && (
            <p className="form-error">{errors.expenseGrowthRate}</p>
          )}
        </div>

        {/* 支出合計の表示 */}
        {(data.livingExpenses || data.housingExpenses || data.otherExpenses) && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-900 mb-2">支出合計</h3>
            <div className="space-y-1 text-sm text-red-800">
              <div className="flex justify-between">
                <span>生活費:</span>
                <span>{formatCurrency(data.livingExpenses || 0)}円/月</span>
              </div>
              <div className="flex justify-between">
                <span>住居費:</span>
                <span>{formatCurrency(data.housingExpenses || 0)}円/月</span>
              </div>
              <div className="flex justify-between">
                <span>その他:</span>
                <span>{formatCurrency(data.otherExpenses || 0)}円/月</span>
              </div>
              <div className="flex justify-between font-medium border-t border-red-300 pt-1">
                <span>月間支出合計:</span>
                <span>{formatCurrency(calculateMonthlyTotal())}円/月</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>年間支出合計:</span>
                <span>{formatCurrency(calculateAnnualTotal())}円/年</span>
              </div>
            </div>
          </div>
        )}

        {/* フォームの説明 */}
        <Alert variant="info">
          <strong>入力のヒント：</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• 月々の平均的な支出額を入力してください</li>
            <li>• 住宅ローンの返済がある場合は住居費に含めてください</li>
            <li>• 年単位で発生する支出（保険料、税金など）は月割りして入力してください</li>
            <li>• 支出成長率はインフレ率（通常1-3%）を参考に設定してください</li>
            <li>• 教育費は次のステップで別途入力します</li>
          </ul>
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
            type="submit"
            variant="primary"
            disabled={!isValid}
          >
            次へ
          </Button>
        </div>
      </form>
    </div>
  );
};
