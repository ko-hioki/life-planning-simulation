import React from 'react';
import { Input, Select, Button, Alert } from '../ui';
import { useFormValidation } from '../../hooks';
import { validateIncome } from '../../utils/validation';
import type { Income, ValidationError } from '../../types';

interface IncomeInfoFormProps {
  data: Partial<Income>;
  onUpdate: (data: Partial<Income>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const IncomeInfoForm: React.FC<IncomeInfoFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  // バリデーション関数をフック用に変換
  const validateIncomeForm = (formData: Partial<Income>): Record<string, string> => {
    const validationErrors = validateIncome(formData);
    return validationErrors.reduce((acc: Record<string, string>, error: ValidationError) => {
      acc[error.field] = error.message;
      return acc;
    }, {});
  };

  const { errors, isValid, validate } = useFormValidation(
    data,
    validateIncomeForm
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof Income, value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    const updatedData = { ...data, [field]: numValue };
    onUpdate(updatedData);
    validate(updatedData);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ja-JP').format(value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-smarthr-black mb-2">収入情報</h2>
        <p className="text-smarthr-grey-60">
          現在の年収と将来の収入見込みを入力してください。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 本人の年収 */}
        <div>
          <label className="form-label form-label-required">
            本人の年収（税込）
          </label>
          <Input
            type="number"
            value={data.userIncome || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleInputChange('userIncome', e.target.value)
            }
            placeholder="5000000"
            min="0"
            step="10000"
            error={errors.userIncome}
            className={errors.userIncome ? 'form-input-error' : ''}
          />
          <p className="text-sm text-gray-500 mt-1">
            単位：円 
            {data.userIncome ? ` (${formatCurrency(data.userIncome)}円)` : ''}
          </p>
          {errors.userIncome && (
            <p className="form-error">{errors.userIncome}</p>
          )}
        </div>

        {/* 配偶者の年収 */}
        <div>
          <label className="form-label">
            配偶者の年収（税込）
          </label>
          <Input
            type="number"
            value={data.spouseIncome || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleInputChange('spouseIncome', e.target.value)
            }
            placeholder="0"
            min="0"
            step="10000"
            error={errors.spouseIncome}
            className={errors.spouseIncome ? 'form-input-error' : ''}
          />
          <p className="text-sm text-gray-500 mt-1">
            単位：円 
            {data.spouseIncome ? ` (${formatCurrency(data.spouseIncome)}円)` : ''}
            {!data.spouseIncome && ' (配偶者がいない場合や専業主婦/主夫の場合は0円)'}
          </p>
          {errors.spouseIncome && (
            <p className="form-error">{errors.spouseIncome}</p>
          )}
        </div>

        {/* その他の収入 */}
        <div>
          <label className="form-label">
            その他の収入（年額）
          </label>
          <Input
            type="number"
            value={data.otherIncome || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleInputChange('otherIncome', e.target.value)
            }
            placeholder="0"
            min="0"
            step="10000"
            error={errors.otherIncome}
            className={errors.otherIncome ? 'form-input-error' : ''}
          />
          <p className="text-sm text-gray-500 mt-1">
            単位：円 
            {data.otherIncome ? ` (${formatCurrency(data.otherIncome)}円)` : ''}
            <br />
            不動産収入、副業収入、投資収益など
          </p>
          {errors.otherIncome && (
            <p className="form-error">{errors.otherIncome}</p>
          )}
        </div>

        {/* 収入成長率 */}
        <div>
          <label className="form-label">
            年収成長率
          </label>
          <Select
            value={data.incomeGrowthRate?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleInputChange('incomeGrowthRate', parseFloat(e.target.value))
            }
            error={errors.incomeGrowthRate}
          >
            <option value="">成長率を選択してください</option>
            <option value="0">0% (収入変化なし)</option>
            <option value="0.01">1% (低成長)</option>
            <option value="0.02">2% (標準的な成長)</option>
            <option value="0.03">3% (高成長)</option>
            <option value="0.05">5% (非常に高い成長)</option>
            <option value="-0.01">-1% (収入減少)</option>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            将来の昇進や昇給を考慮した年平均の収入成長率
          </p>
          {errors.incomeGrowthRate && (
            <p className="form-error">{errors.incomeGrowthRate}</p>
          )}
        </div>

        {/* 収入合計の表示 */}
        {(data.userIncome || data.spouseIncome || data.otherIncome) && (
          <div className="bg-smarthr-blue-05 p-4 rounded-lg border border-smarthr-blue-20">
            <h3 className="font-medium text-blue-900 mb-2">収入合計</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>本人年収:</span>
                <span>{formatCurrency(data.userIncome || 0)}円</span>
              </div>
              <div className="flex justify-between">
                <span>配偶者年収:</span>
                <span>{formatCurrency(data.spouseIncome || 0)}円</span>
              </div>
              <div className="flex justify-between">
                <span>その他収入:</span>
                <span>{formatCurrency(data.otherIncome || 0)}円</span>
              </div>
              <div className="flex justify-between font-medium border-t border-blue-300 pt-1">
                <span>世帯年収:</span>
                <span>{formatCurrency((data.userIncome || 0) + (data.spouseIncome || 0) + (data.otherIncome || 0))}円</span>
              </div>
            </div>
          </div>
        )}

        {/* フォームの説明 */}
        <Alert variant="info">
          <strong>入力のヒント：</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• 年収は税込みの総支給額（賞与含む）を入力してください</li>
            <li>• 収入成長率は過去の昇給実績や業界動向を参考に設定してください</li>
            <li>• 退職後の収入減少は年金情報で考慮されます</li>
            <li>• 不確実な収入（投資など）は控えめに見積もることをお勧めします</li>
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
