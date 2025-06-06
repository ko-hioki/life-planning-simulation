import React, { useState, useCallback } from 'react';
import { Input, Select, Button, Alert } from '../ui';
import { validateChild } from '../../utils/validation';
import type { Child, EducationPath, ValidationError } from '../../types';

interface ChildrenInfoFormProps {
  data: Child[];
  onUpdate: (data: Child[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ChildrenInfoForm: React.FC<ChildrenInfoFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  // 子供を追加
  const addChild = useCallback(() => {
    const newChild: Child = {
      id: `child-${Date.now()}`,
      name: '',
      birthYear: new Date().getFullYear(),
      educationPath: {
        elementary: true,
        juniorHigh: true,
        highSchool: 'public',
        university: 'none',
        graduateSchool: false,
      },
    };
    onUpdate([...data, newChild]);
  }, [data, onUpdate]);

  // 子供を削除
  const removeChild = useCallback((childId: string) => {
    onUpdate(data.filter(child => child.id !== childId));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[childId];
      return newErrors;
    });
  }, [data, onUpdate]);

  // 子供の情報を更新
  const updateChild = useCallback((childId: string, field: keyof Child, value: any) => {
    const updatedData = data.map(child => 
      child.id === childId ? { ...child, [field]: value } : child
    );
    onUpdate(updatedData);
    
    // バリデーション
    const child = updatedData.find(c => c.id === childId);
    if (child) {
      const childIndex = updatedData.findIndex(c => c.id === childId);
      const childErrors = validateChild(child, childIndex);
      const errorMap = childErrors.reduce((acc: Record<string, string>, error: ValidationError) => {
        acc[error.field] = error.message;
        return acc;
      }, {});
      
      setErrors(prev => ({
        ...prev,
        [childId]: errorMap,
      }));
    }
  }, [data, onUpdate]);

  // 教育パスを更新
  const updateEducationPath = useCallback((childId: string, field: keyof EducationPath, value: any) => {
    const updatedData = data.map(child => 
      child.id === childId 
        ? { ...child, educationPath: { ...child.educationPath, [field]: value } }
        : child
    );
    onUpdate(updatedData);
  }, [data, onUpdate]);

  // フォーム送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 全ての子供の情報をバリデーション
    let hasErrors = false;
    const allErrors: Record<string, Record<string, string>> = {};
    
    data.forEach((child, index) => {
      const childErrors = validateChild(child, index);
      if (childErrors.length > 0) {
        hasErrors = true;
        allErrors[child.id] = childErrors.reduce((acc: Record<string, string>, error: ValidationError) => {
          acc[error.field] = error.message;
          return acc;
        }, {});
      }
    });
    
    setErrors(allErrors);
    
    if (!hasErrors) {
      onNext();
    }
  };

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">子供・教育情報</h2>
        <p className="text-gray-600">
          お子様の情報と教育プランを入力してください。（任意）
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 子供のリスト */}
        {data.map((child, index) => (
          <div key={child.id} className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                お子様 {index + 1}
              </h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => removeChild(child.id)}
                className="text-red-600 hover:text-red-800"
              >
                削除
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 名前 */}
              <div>
                <label className="form-label form-label-required">
                  お名前
                </label>
                <Input
                  type="text"
                  value={child.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    updateChild(child.id, 'name', e.target.value)
                  }
                  placeholder="山田花子"
                  error={errors[child.id]?.name}
                  className={errors[child.id]?.name ? 'form-input-error' : ''}
                />
                {errors[child.id]?.name && (
                  <p className="form-error">{errors[child.id]?.name}</p>
                )}
              </div>

              {/* 生年 */}
              <div>
                <label className="form-label form-label-required">
                  生年
                </label>
                <Select
                  value={child.birthYear.toString()}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    updateChild(child.id, 'birthYear', parseInt(e.target.value))
                  }
                  error={errors[child.id]?.birthYear}
                >
                  {birthYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </Select>
                {errors[child.id]?.birthYear && (
                  <p className="form-error">{errors[child.id]?.birthYear}</p>
                )}
              </div>
            </div>

            {/* 教育パス */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">教育プラン</h4>
              
              <div className="space-y-3">
                {/* 高校 */}
                <div>
                  <label className="form-label">高等学校</label>
                  <Select
                    value={child.educationPath.highSchool}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      updateEducationPath(child.id, 'highSchool', e.target.value as 'public' | 'private')
                    }
                  >
                    <option value="public">公立高校</option>
                    <option value="private">私立高校</option>
                  </Select>
                </div>

                {/* 大学 */}
                <div>
                  <label className="form-label">大学</label>
                  <Select
                    value={child.educationPath.university}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      updateEducationPath(child.id, 'university', e.target.value as 'none' | 'national' | 'private')
                    }
                  >
                    <option value="none">進学しない</option>
                    <option value="national">国立大学</option>
                    <option value="private">私立大学</option>
                  </Select>
                </div>

                {/* 大学院 */}
                {child.educationPath.university !== 'none' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`graduate-${child.id}`}
                      checked={child.educationPath.graduateSchool}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateEducationPath(child.id, 'graduateSchool', e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`graduate-${child.id}`} className="ml-2 text-sm text-gray-700">
                      大学院に進学する
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 推定教育費 */}
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h5 className="text-sm font-medium text-blue-900 mb-1">推定教育費</h5>
              <p className="text-xs text-blue-700">
                ※概算値です。実際の費用は学校や地域により異なります。
              </p>
              {/* TODO: 教育費計算ロジックを実装 */}
            </div>
          </div>
        ))}

        {/* 子供を追加ボタン */}
        <Button
          type="button"
          variant="secondary"
          onClick={addChild}
          className="w-full"
        >
          + お子様を追加
        </Button>

        {/* 子供がいない場合の説明 */}
        {data.length === 0 && (
          <Alert variant="info">
            お子様がいない場合や、すでに独立している場合は、
            このステップをスキップして次に進むことができます。
          </Alert>
        )}

        {/* フォームの説明 */}
        <Alert variant="info">
          <strong>教育費について：</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• 教育費は文部科学省の統計データを基に自動計算されます</li>
            <li>• 私立の場合は公立より高額になります</li>
            <li>• 大学進学時の一人暮らし費用なども考慮されます</li>
            <li>• 塾や習い事の費用は別途生活費に含めてください</li>
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
          >
            次へ
          </Button>
        </div>
      </form>
    </div>
  );
};
