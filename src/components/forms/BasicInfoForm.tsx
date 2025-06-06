import React from 'react';
import { Input, Select, Button, Alert } from '../ui';
import { useFormValidation } from '../../hooks';
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
  const { errors, isValid, validate } = useFormValidation(
    data,
    validateBasicInfo
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof UserInfo, value: string | number | boolean) => {
    const updatedData = { ...data, [field]: value };
    onUpdate(updatedData);
    validate(updatedData);
  };

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 80 }, (_, i) => currentYear - 20 - i);
  const ageOptions = Array.from({ length: 45 }, (_, i) => 50 + i);

  return (
    <div className="max-w-2xl mx-auto">
      {/* フォームヘッダー */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">基本情報の入力</h2>
        <p className="text-gray-600">
          まずは、あなたとご家族の基本的な情報を教えてください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* あなたの情報セクション */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🙋‍♂️</span>
            あなたの情報
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 名前 */}
            <div className="md:col-span-2">
              <label className="form-label form-label-required">
                お名前
              </label>
              <Input
                type="text"
                value={data.name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                placeholder="例: 山田太郎"
                error={errors.name}
                className={errors.name ? 'form-input-error' : ''}
                aria-describedby="name-help"
              />
              <p id="name-help" className="text-sm text-gray-500 mt-1">
                💡 シミュレーション結果で表示される名前です。ニックネームでも構いません。
              </p>
              {errors.name && (
                <p className="form-error" role="alert">{errors.name}</p>
              )}
            </div>

            {/* 生年 */}
            <div>
              <label className="form-label form-label-required">
                生年
              </label>
              <Select
                value={data.birthYear?.toString() || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('birthYear', parseInt(e.target.value))}
                error={errors.birthYear}
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
              {errors.birthYear && (
                <p className="form-error" role="alert">{errors.birthYear}</p>
              )}
            </div>

            {/* 退職予定年齢 */}
            <div>
              <label className="form-label form-label-required">
                退職予定年齢
              </label>
              <Select
                value={data.retirementAge?.toString() || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('retirementAge', parseInt(e.target.value))}
                error={errors.retirementAge}
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
              {errors.retirementAge && (
                <p className="form-error" role="alert">{errors.retirementAge}</p>
              )}
            </div>
          </div>
        </div>

        {/* 配偶者の情報セクション */}
        <div className="bg-pink-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
                  <span className="text-gray-700">あり</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasSpouse"
                    value="false"
                    checked={data.hasSpouse === false}
                    onChange={(e) => handleInputChange('hasSpouse', e.target.value === 'true')}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-gray-700">なし</span>
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
                <label className="form-label form-label-required">
                  配偶者の生年
                </label>
                <Select
                  value={data.spouseBirthYear?.toString() || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('spouseBirthYear', parseInt(e.target.value))}
                  error={errors.spouseBirthYear}
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
                {errors.spouseBirthYear && (
                  <p className="form-error" role="alert">{errors.spouseBirthYear}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 現在の資産セクション */}
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💰</span>
            現在の資産状況
          </h3>
          
          <div>
            <label className="form-label">
              現在の貯蓄額（円）
            </label>
            <Input
              type="number"
              value={data.currentSavings || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('currentSavings', parseInt(e.target.value) || 0)}
              placeholder="例: 5000000"
              min="0"
              step="10000"
              error={errors.currentSavings}
              className={errors.currentSavings ? 'form-input-error' : ''}
              aria-describedby="savings-help"
            />
            <p id="savings-help" className="text-sm text-gray-500 mt-1">
              💡 銀行預金、定期預金などの現金・預金の合計額を入力してください。投資信託や株式は除きます。
            </p>
            {errors.currentSavings && (
              <p className="form-error" role="alert">{errors.currentSavings}</p>
            )}
          </div>
        </div>

        {/* フォームの説明 */}
        <Alert variant="info" className="bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <span className="mr-2 text-xl">💡</span>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">入力のヒント</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• 退職予定年齢は公的年金の受給開始年齢（65歳）を考慮して設定してください</li>
                <li>• 現在の貯蓄額には普通預金、定期預金などの現金・預金を含めてください</li>
                <li>• 配偶者がいる場合は、世帯全体での計算を行います</li>
              </ul>
            </div>
          </div>
        </Alert>

        {/* ナビゲーションボタン */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex items-center space-x-2"
          >
            <span>←</span>
            <span>キャンセル</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              ステップ 1 / 6
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid}
              className="flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span>次へ</span>
              <span>→</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
