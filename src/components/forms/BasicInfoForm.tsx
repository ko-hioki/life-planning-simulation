import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Alert } from '../ui';
import { validateBasicInfo } from '../../utils/validation';
import type { UserInfo } from '../../types';

interface BasicInfoFormProps {
  data: Partial<UserInfo>;
  onUpdate: (data: Partial<UserInfo>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  data,
  onUpdate,
  onNext,
  onCancel,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // dataの変更時にバリデーションを実行
  useEffect(() => {
    const validationErrors = validateBasicInfo(data);
    setErrors(validationErrors);
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateBasicInfo(data);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof UserInfo, value: string | number | boolean) => {
    // 文字列フィールドで空文字列の場合はundefinedに変換
    let processedValue: any = value;
    if (typeof value === 'string' && value === '' && field === 'name') {
      processedValue = undefined;
    }
    
    const updatedData = { ...data, [field]: processedValue };
    onUpdate(updatedData);
  };

  const isValid = Object.keys(errors).length === 0;

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 80 }, (_, i) => currentYear - 20 - i);
  const ageOptions = Array.from({ length: 45 }, (_, i) => 50 + i);

  return (
    <div className="max-w-2xl mx-auto">
      {/* フォームヘッダー */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-smarthr-blue-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-smarthr-black mb-2">基本情報の入力</h2>
        <p className="text-smarthr-grey-60">
          まずは、あなたとご家族の基本的な情報を教えてください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* あなたの情報セクション */}
        <div className="bg-smarthr-blue-05 border border-smarthr-blue-20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-smarthr-black mb-4 flex items-center">
            <span className="mr-2">🙋‍♂️</span>
            あなたの情報
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 名前 */}
            <div className="md:col-span-2">
              <Input
                id="name"
                type="text"
                value={data.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                placeholder="例: 山田太郎"
                error={errors.name}
                required
                label="お名前"
                helpText="💡 シミュレーション結果で表示される名前です。ニックネームでも構いません。"
                aria-describedby="name-help"
              />
            </div>

            {/* 生年 */}
            <div>
              <Select
                id="birthYear"
                value={data.birthYear?.toString() || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('birthYear', parseInt(e.target.value))}
                error={errors.birthYear}
                required
                label="生年"
                aria-describedby="birth-year-help"
              >
                <option value="">年を選択してください</option>
                {birthYearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}年 ({currentYear - year}歳)
                  </option>
                ))}
              </Select>
              <p id="birth-year-help" className="text-sm text-gray-500 mt-1">
                💡 年金受給開始時期の計算に使用されます
              </p>
            </div>

            {/* 退職予定年齢 */}
            <div>
              <Select
                id="retirementAge"
                value={data.retirementAge?.toString() || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('retirementAge', parseInt(e.target.value))}
                error={errors.retirementAge}
                required
                label="退職予定年齢"
                aria-describedby="retirement-age-help"
              >
                <option value="">年齢を選択してください</option>
                {ageOptions.map((age) => (
                  <option key={age} value={age}>
                    {age}歳
                  </option>
                ))}
              </Select>
              <p id="retirement-age-help" className="text-sm text-gray-500 mt-1">
                💡 退職後の生活費計算に使用されます
              </p>
            </div>
          </div>
        </div>

        {/* 配偶者の情報セクション */}
        <div className="bg-smarthr-pink-05 border border-smarthr-pink-20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-smarthr-black mb-4 flex items-center">
            <span className="mr-2">👫</span>
            ご家族の情報
          </h3>
          
          <div className="space-y-6">
            {/* 配偶者の有無 */}
            <div>
              <label className="form-label form-label-required">
                配偶者はいらっしゃいますか？
              </label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasSpouse"
                    value="true"
                    checked={data.hasSpouse === true}
                    onChange={(e) => handleInputChange('hasSpouse', e.target.value === 'true')}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-gray-700">はい</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasSpouse"
                    value="false"
                    checked={data.hasSpouse === false}
                    onChange={(e) => handleInputChange('hasSpouse', e.target.value === 'false')}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-gray-700">いいえ</span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                💡 世帯収入や年金額の計算に影響します
              </p>
              {errors.hasSpouse && (
                <p className="form-error" role="alert">{errors.hasSpouse}</p>
              )}
            </div>

            {/* 配偶者の生年（配偶者ありの場合のみ） */}
            {data.hasSpouse && (
              <div>
                <h3 className="text-lg font-semibold text-smarthr-black mb-4 flex items-center">
                  <span className="mr-2">👫</span>
                  配偶者の情報
                </h3>
                <Select
                  id="spouseBirthYear"
                  value={data.spouseBirthYear?.toString() || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('spouseBirthYear', parseInt(e.target.value))}
                  error={errors.spouseBirthYear}
                  required
                  label="配偶者の生年"
                  aria-describedby="spouse-birth-year-help"
                >
                  <option value="">年を選択してください</option>
                  {birthYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}年 ({currentYear - year}歳)
                    </option>
                  ))}
                </Select>
                <p id="spouse-birth-year-help" className="text-sm text-gray-500 mt-1">
                  💡 配偶者の年金受給開始時期の計算に使用されます
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 現在の資産セクション */}
        <div className="bg-smarthr-green-05 border border-smarthr-green-20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-smarthr-black mb-4 flex items-center">
            <span className="mr-2">💰</span>
            現在の資産状況
          </h3>
          
          <div>
            <Input
              id="currentSavings"
              type="number"
              value={data.currentSavings?.toString() || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                const numValue = value === '' ? 0 : parseInt(value, 10) || 0;
                handleInputChange('currentSavings', numValue);
              }}
              placeholder="例: 5000000"
              min="0"
              step="10000"
              error={errors.currentSavings}
              label="現在の貯蓄額（円）"
              helpText="💡 現在お持ちの預貯金・投資などの合計額をご入力ください"
              aria-describedby="current-savings-help"
            />
          </div>
        </div>

        {/* フォームの説明 */}
        <Alert variant="info" className="bg-smarthr-blue-05 border-smarthr-blue-20">
          <div className="flex items-start">
            <span className="mr-2 text-xl">💡</span>
            <div>
              <h4 className="font-medium text-smarthr-blue-80 mb-2">入力のヒント</h4>
              <ul className="space-y-1 text-sm text-smarthr-blue-70">
                <li>• 退職予定年齢は公的年金の受給開始年齢（65歳）を考慮して設定してください</li>
                <li>• 現在の貯蓄額には普通預金、定期預金などの現金・預金を含めてください</li>
                <li>• 配偶者がいる場合は、世帯全体での計算を行います</li>
              </ul>
            </div>
          </div>
        </Alert>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between items-center pt-8 border-t border-smarthr-grey-20">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex items-center space-x-2"
          >
            <span>←</span>
            <span>キャンセル</span>
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid}
            className="flex items-center space-x-2"
          >
            <span>次へ</span>
            <span>→</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
