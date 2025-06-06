import { useState, useEffect, useCallback } from 'react';
import type { LifePlan } from '../types';
import { StorageManager } from '../utils/storage';

/**
 * ライフプラン管理フック
 */
export const useLifePlans = () => {
  const [lifePlans, setLifePlans] = useState<LifePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期データ読み込み
  useEffect(() => {
    try {
      const plans = StorageManager.getLifePlans();
      setLifePlans(plans);
    } catch (err) {
      setError('ライフプランの読み込みに失敗しました');
      console.error('Error loading life plans:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ライフプラン保存
  const saveLifePlan = useCallback(async (lifePlan: LifePlan) => {
    try {
      StorageManager.saveLifePlan(lifePlan);
      setLifePlans(prev => {
        const filtered = prev.filter(p => p.id !== lifePlan.id);
        return [...filtered, lifePlan].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      });
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ライフプランの保存に失敗しました';
      setError(message);
      throw err;
    }
  }, []);

  // ライフプラン削除
  const deleteLifePlan = useCallback(async (planId: string) => {
    try {
      StorageManager.deleteLifePlan(planId);
      setLifePlans(prev => prev.filter(p => p.id !== planId));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ライフプランの削除に失敗しました';
      setError(message);
      throw err;
    }
  }, []);

  // ライフプラン複製
  const duplicateLifePlan = useCallback(async (planId: string, newName: string) => {
    try {
      const duplicated = StorageManager.duplicateLifePlan(planId, newName);
      setLifePlans(prev => [duplicated, ...prev]);
      setError(null);
      return duplicated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ライフプランの複製に失敗しました';
      setError(message);
      throw err;
    }
  }, []);

  // 特定プラン取得
  const getLifePlan = useCallback((planId: string) => {
    return lifePlans.find(p => p.id === planId) || null;
  }, [lifePlans]);

  return {
    lifePlans,
    isLoading,
    error,
    saveLifePlan,
    deleteLifePlan,
    duplicateLifePlan,
    getLifePlan,
  };
};

/**
 * フォームバリデーションフック
 */
export const useFormValidation = <T>(
  initialData: T,
  validator: (data: T) => Record<string, string>
) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);

  // バリデーション実行
  const validate = useCallback((dataToValidate?: T) => {
    setIsValidating(true);
    const validationErrors = validator(dataToValidate || data);
    setErrors(validationErrors);
    setIsValidating(false);
    return Object.keys(validationErrors).length === 0;
  }, [data, validator]);

  // フィールド値更新
  const updateField = useCallback((field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }));
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  // フォームリセット
  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // 計算されたプロパティ
  const isValid = Object.keys(errors).length === 0;
  const hasErrors = Object.keys(errors).length > 0;

  return {
    data,
    setData,
    errors,
    touched,
    isValidating,
    isValid,
    hasErrors,
    validate,
    updateField,
    resetForm,
    getFieldError: (field: string) => errors[field],
    isFieldTouched: (field: string) => touched[field] || false,
  };
};

/**
 * ウィザードステップ管理フック
 */
export const useWizard = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));

  // 次のステップへ
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      setVisitedSteps(prev => new Set([...prev, nextStepIndex]));
    }
  }, [currentStep, totalSteps]);

  // 前のステップへ
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // 特定ステップへ移動
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
      setVisitedSteps(prev => new Set([...prev, step]));
    }
  }, [totalSteps]);

  // ステップを完了済みにマーク
  const markStepCompleted = useCallback((step: number) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  }, []);

  // ステップが完了済みかチェック
  const isStepCompleted = useCallback((step: number) => {
    return completedSteps.has(step);
  }, [completedSteps]);

  // ステップが訪問済みかチェック
  const isStepVisited = useCallback((step: number) => {
    return visitedSteps.has(step);
  }, [visitedSteps]);

  // 進行状況パーセンテージ
  const progress = Math.round(((completedSteps.size) / totalSteps) * 100);

  // 次のステップが利用可能かチェック
  const canGoNext = currentStep < totalSteps - 1;

  // 前のステップが利用可能かチェック
  const canGoPrev = currentStep > 0;

  // 最終ステップかチェック
  const isLastStep = currentStep === totalSteps - 1;

  // 最初のステップかチェック
  const isFirstStep = currentStep === 0;

  return {
    currentStep,
    completedSteps,
    visitedSteps,
    nextStep,
    prevStep,
    goToStep,
    markStepCompleted,
    isStepCompleted,
    isStepVisited,
    progress,
    canGoNext,
    canGoPrev,
    isLastStep,
    isFirstStep,
  };
};

/**
 * ローカルストレージ使用量監視フック
 */
export const useStorageQuota = () => {
  const [quota, setQuota] = useState({ used: 0, available: 0, percentage: 0 });
  
  const checkQuota = useCallback(() => {
    // storage.tsからインポートする関数を使用
    // const quotaInfo = checkStorageQuota();
    // setQuota(quotaInfo);
    // 現在は仮実装
    setQuota({ used: 1024, available: 5120, percentage: 20 });
  }, []);

  useEffect(() => {
    checkQuota();
  }, [checkQuota]);

  return { quota, checkQuota };
};

/**
 * デバウンス処理フック
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
