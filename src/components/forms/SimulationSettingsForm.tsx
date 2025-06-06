import React from 'react';
import { Select, Button, Alert } from '../ui';
import { useFormValidation } from '../../hooks';
import { validateSimulationParameters } from '../../utils/validation';
import type { SimulationParameters, ValidationError } from '../../types';

interface SimulationSettingsFormProps {
  data: Partial<SimulationParameters>;
  onUpdate: (data: Partial<SimulationParameters>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SimulationSettingsForm: React.FC<SimulationSettingsFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  // バリデーション関数をフック用に変換
  const validateSimulationForm = (formData: Partial<SimulationParameters>): Record<string, string> => {
    const validationErrors = validateSimulationParameters(formData);
    return validationErrors.reduce((acc: Record<string, string>, error: ValidationError) => {
      acc[error.field] = error.message;
      return acc;
    }, {});
  };

  const { errors, isValid, validate } = useFormValidation(
    data,
    validateSimulationForm
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof SimulationParameters, value: string | number) => {
    const updatedData = { ...data, [field]: value };
    onUpdate(updatedData);
    validate(updatedData);
  };

  const currentYear = new Date().getFullYear();
  const startYearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const endYearOptions = Array.from({ length: 50 }, (_, i) => currentYear + 10 + i);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">シミュレーション設定</h2>
        <p className="text-gray-600">
          シミュレーション期間と前提条件を設定してください。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* シミュレーション開始年 */}
        <div>
          <label className="form-label form-label-required">
            シミュレーション開始年
          </label>
          <Select
            value={data.simulationStartYear?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleInputChange('simulationStartYear', parseInt(e.target.value))
            }
            error={errors.simulationStartYear}
          >
            <option value="">開始年を選択してください</option>
            {startYearOptions.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            通常は今年または来年を選択します
          </p>
          {errors.simulationStartYear && (
            <p className="form-error">{errors.simulationStartYear}</p>
          )}
        </div>

        {/* シミュレーション終了年 */}
        <div>
          <label className="form-label form-label-required">
            シミュレーション終了年
          </label>
          <Select
            value={data.simulationEndYear?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleInputChange('simulationEndYear', parseInt(e.target.value))
            }
            error={errors.simulationEndYear}
          >
            <option value="">終了年を選択してください</option>
            {endYearOptions.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            老後の生活期間も考慮して設定してください（通常80-90歳まで）
          </p>
          {errors.simulationEndYear && (
            <p className="form-error">{errors.simulationEndYear}</p>
          )}
        </div>

        {/* インフレ率 */}
        <div>
          <label className="form-label form-label-required">
            想定インフレ率（年率）
          </label>
          <Select
            value={data.inflationRate?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleInputChange('inflationRate', parseFloat(e.target.value))
            }
            error={errors.inflationRate}
          >
            <option value="">インフレ率を選択してください</option>
            <option value="0">0% (デフレ・物価変動なし)</option>
            <option value="0.01">1% (低インフレ)</option>
            <option value="0.02">2% (日銀目標水準)</option>
            <option value="0.03">3% (高インフレ)</option>
            <option value="0.04">4% (非常に高いインフレ)</option>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            日本銀行の物価安定目標は2%です
          </p>
          {errors.inflationRate && (
            <p className="form-error">{errors.inflationRate}</p>
          )}
        </div>

        {/* 投資リターン率 */}
        <div>
          <label className="form-label form-label-required">
            想定投資リターン率（年率）
          </label>
          <Select
            value={data.investmentReturnRate?.toString() || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
              handleInputChange('investmentReturnRate', parseFloat(e.target.value))
            }
            error={errors.investmentReturnRate}
          >
            <option value="">投資リターン率を選択してください</option>
            <option value="0">0% (預金のみ)</option>
            <option value="0.01">1% (非常に保守的)</option>
            <option value="0.02">2% (保守的)</option>
            <option value="0.03">3% (やや保守的)</option>
            <option value="0.04">4% (標準的)</option>
            <option value="0.05">5% (やや積極的)</option>
            <option value="0.06">6% (積極的)</option>
            <option value="0.07">7% (非常に積極的)</option>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            リスク許容度に応じて設定してください。過度に楽観的な設定は避けましょう。
          </p>
          {errors.investmentReturnRate && (
            <p className="form-error">{errors.investmentReturnRate}</p>
          )}
        </div>

        {/* 設定の説明と注意事項 */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-900 mb-2">設定の目安</h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <div>
              <strong>保守的：</strong> インフレ率1-2%、投資リターン率2-4%
            </div>
            <div>
              <strong>標準的：</strong> インフレ率2%、投資リターン率4-5%
            </div>
            <div>
              <strong>積極的：</strong> インフレ率2-3%、投資リターン率5-7%
            </div>
          </div>
        </div>

        {/* シミュレーション期間の表示 */}
        {data.simulationStartYear && data.simulationEndYear && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">シミュレーション期間</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>期間:</span>
                <span>
                  {data.simulationStartYear}年 〜 {data.simulationEndYear}年
                  （{data.simulationEndYear - data.simulationStartYear}年間）
                </span>
              </div>
              {data.inflationRate !== undefined && (
                <div className="flex justify-between">
                  <span>想定インフレ率:</span>
                  <span>{(data.inflationRate * 100).toFixed(1)}%</span>
                </div>
              )}
              {data.investmentReturnRate !== undefined && (
                <div className="flex justify-between">
                  <span>想定投資リターン率:</span>
                  <span>{(data.investmentReturnRate * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* フォームの説明 */}
        <Alert variant="info">
          <strong>設定のヒント：</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• インフレ率は過去の統計や経済予測を参考に設定してください</li>
            <li>• 投資リターン率は投資商品の種類とリスク許容度を考慮してください</li>
            <li>• 保守的な設定での計画を立て、余裕を持った資金計画をお勧めします</li>
            <li>• 設定はいつでも変更してシミュレーションを再実行できます</li>
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
