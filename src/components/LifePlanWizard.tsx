import React, { useState, useCallback } from 'react';
import { useWizard } from '../hooks';
import { Wizard } from './wizard';
import { 
  BasicInfoForm, 
  IncomeInfoForm, 
  ExpenseInfoForm, 
  ChildrenInfoForm, 
  SimulationSettingsForm, 
  ReviewForm 
} from './forms';
import { Button, Alert } from './ui';
import type { UserInfo, Income, Expenses, Child, SimulationParameters, LifePlan } from '../types';

interface LifePlanWizardProps {
  onComplete: (lifePlan: LifePlan) => void;
  onCancel: () => void;
  initialData?: LifePlan; // 編集モード用の初期データ
}

export const LifePlanWizard: React.FC<LifePlanWizardProps> = ({
  onComplete,
  onCancel,
  initialData,
}) => {
  // ウィザードステップの定義
  const wizardSteps = [
    { 
      id: 'basic-info', 
      title: '基本情報', 
      description: 'あなたとご家族の基本的な情報を入力してください',
      icon: '👤',
      component: BasicInfoForm,
      isCompleted: false,
    },
    { 
      id: 'income', 
      title: '収入情報', 
      description: '現在と将来の収入見込みを入力してください',
      icon: '💰',
      component: IncomeInfoForm,
      isCompleted: false,
    },
    { 
      id: 'expenses', 
      title: '支出情報', 
      description: '月々の支出を入力してください',
      icon: '💳',
      component: ExpenseInfoForm,
      isCompleted: false,
    },
    { 
      id: 'children', 
      title: '子供・教育', 
      description: 'お子様の情報と教育プランを入力してください',
      icon: '👶',
      component: ChildrenInfoForm,
      isCompleted: false,
      isOptional: true,
    },
    { 
      id: 'simulation', 
      title: 'シミュレーション設定', 
      description: 'シミュレーション期間と前提条件を設定してください',
      icon: '⚙️',
      component: SimulationSettingsForm,
      isCompleted: false,
    },
    { 
      id: 'review', 
      title: '確認・保存', 
      description: '入力内容を確認し、プランを保存してください',
      icon: '✅',
      component: ReviewForm,
      isCompleted: false,
    },
  ];

  // ウィザードの状態管理
  const {
    currentStep,
    canGoNext,
    canGoPrev,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    progress,
    markStepCompleted,
  } = useWizard(wizardSteps.length);

  // フォームデータの状態
  const [formData, setFormData] = useState({
    basicInfo: {
      name: initialData?.user?.name || '',
      birthYear: initialData?.user?.birthYear || undefined,
      hasSpouse: !!initialData?.spouse,
      spouseBirthYear: initialData?.spouse?.birthYear || undefined,
      retirementAge: initialData?.user?.retirementAge || undefined,
      currentSavings: initialData?.assets?.savings || undefined,
    } as Partial<UserInfo>,
    income: (initialData?.income || {}) as Partial<Income>,
    expenses: (initialData?.expenses || {}) as Partial<Expenses>,
    children: (initialData?.children || []) as Child[],
    simulationSettings: (initialData?.simulationParameters || {}) as Partial<SimulationParameters>,
  });

  const [error, setError] = useState<string | null>(null);

  // 基本情報の更新
  const handleBasicInfoUpdate = useCallback((data: Partial<UserInfo>) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: data,
    }));
  }, []);

  // 収入情報の更新
  const handleIncomeUpdate = useCallback((data: Partial<Income>) => {
    setFormData(prev => ({
      ...prev,
      income: data,
    }));
  }, []);

  // 支出情報の更新
  const handleExpensesUpdate = useCallback((data: Partial<Expenses>) => {
    setFormData(prev => ({
      ...prev,
      expenses: data,
    }));
  }, []);

  // 子供情報の更新
  const handleChildrenUpdate = useCallback((data: Child[]) => {
    setFormData(prev => ({
      ...prev,
      children: data,
    }));
  }, []);

  // シミュレーション設定の更新
  const handleSimulationSettingsUpdate = useCallback((data: Partial<SimulationParameters>) => {
    setFormData(prev => ({
      ...prev,
      simulationSettings: data,
    }));
  }, []);

  // ステップ完了ハンドラー
  const handleStepNext = useCallback((stepIndex: number) => {
    markStepCompleted(stepIndex);
    nextStep();
  }, [markStepCompleted, nextStep]);

  // 特定のステップに移動
  const handleEditStep = useCallback((stepId: string) => {
    const stepIndex = wizardSteps.findIndex(step => step.id === stepId);
    if (stepIndex >= 0) {
      goToStep(stepIndex);
    }
  }, [goToStep, wizardSteps]);

  // ウィザード完了
  const handleWizardComplete = useCallback(() => {
    try {
      // ライフプランオブジェクトを構築
      const { basicInfo, income, expenses, children, simulationSettings } = formData;

      // バリデーション (簡易的な例)
      if (!basicInfo.name || !basicInfo.birthYear || !basicInfo.retirementAge || basicInfo.currentSavings === undefined) {
        setError('基本情報に未入力の項目があります。');
        goToStep(wizardSteps.findIndex(step => step.id === 'basic-info'));
        return;
      }
      // TODO: 他のステップのバリデーションも同様に追加

      const newPlan: LifePlan = {
        id: initialData?.id || Date.now().toString(),
        name: basicInfo.name || '新しいライフプラン',
        user: {
          name: basicInfo.name!,
          birthYear: basicInfo.birthYear!,
          retirementAge: basicInfo.retirementAge!,
          // ... 他のユーザー情報 (必要に応じて追加)
        },
        spouse: basicInfo.hasSpouse && basicInfo.spouseBirthYear ? {
          birthYear: basicInfo.spouseBirthYear,
          // ... 他の配偶者情報 (必要に応じて追加)
        } : undefined,
        assets: {
          savings: basicInfo.currentSavings!,
          // ... 他の資産情報 (必要に応じて追加)
        },
        income: income as Income, // 型アサーションはデータ構造が一致している前提
        expenses: expenses as Expenses, // 型アサーションはデータ構造が一致している前提
        children: children,
        simulationParameters: simulationSettings as SimulationParameters, // 型アサーションはデータ構造が一致している前提
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      onComplete(newPlan);
    } catch (err) {
      console.error("Error completing wizard:", err);
      setError(err instanceof Error ? err.message : 'プランの作成または更新中にエラーが発生しました。');
    }
  }, [formData, onComplete, initialData, goToStep, wizardSteps, setError]);

  // 現在のステップコンポーネントを取得
  const getCurrentStepComponent = () => {
    const step = wizardSteps[currentStep];
    if (!step) {
      return <Alert variant="error">現在のステップが見つかりません。</Alert>;
    }

    const commonProps = {
      onCancel: onCancel, // WizardPageから渡されたキャンセル処理
    };

    switch (step.id) {
      case 'basic-info':
        return (
          <BasicInfoForm
            data={formData.basicInfo}
            onUpdate={handleBasicInfoUpdate}
            onNext={() => handleStepNext(currentStep)}
            onCancel={commonProps.onCancel}
          />
        );
      case 'income':
        return (
          <IncomeInfoForm
            data={formData.income}
            onUpdate={handleIncomeUpdate}
            onNext={() => handleStepNext(currentStep)}
            onPrev={prevStep}
            onCancel={commonProps.onCancel}
          />
        );
      case 'expenses':
        return (
          <ExpenseInfoForm
            data={formData.expenses}
            onUpdate={handleExpensesUpdate}
            onNext={() => handleStepNext(currentStep)}
            onPrev={prevStep}
            onCancel={commonProps.onCancel}
          />
        );
      case 'children':
        return (
          <ChildrenInfoForm
            data={formData.children}
            onUpdate={handleChildrenUpdate}
            onNext={() => handleStepNext(currentStep)}
            onPrev={prevStep}
            onCancel={commonProps.onCancel}
          />
        );
      case 'simulation':
        return (
          <SimulationSettingsForm
            data={formData.simulationSettings}
            onUpdate={handleSimulationSettingsUpdate}
            onNext={() => handleStepNext(currentStep)}
            onPrev={prevStep}
            onCancel={commonProps.onCancel}
          />
        );
      case 'review':
        return (
          <ReviewForm
            formData={formData}
            onEditStep={handleEditStep}
            onSubmit={handleWizardComplete} // ここをhandleWizardCompleteに
            onPrev={prevStep}
            onCancel={commonProps.onCancel}
          />
        );
      default:
        // フォールバックUIまたはエラー
        return <Alert variant="error">不明なステップです: {step.id}</Alert>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-smarthr-neutral-50">
      {/* ウィザードヘッダー（固定） */}
      <div className="bg-gradient-to-r from-smarthr-blue to-aqua-03 text-white px-6 py-8 sm:px-8 sm:py-10 shrink-0 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-3xl">{wizardSteps[currentStep]?.icon || '📋'}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {initialData ? 'ライフプラン編集' : 'ライフプラン作成'}
                </h1>
                <p className="text-blue-100 text-base">
                  ステップ {currentStep + 1} / {wizardSteps.length}：{wizardSteps[currentStep]?.title}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={onCancel}
              className="text-smarthr-black bg-white hover:bg-gray-100 focus-visible:ring-white"
            >
              <span className="mr-1.5">✕</span>
              キャンセル
            </Button>
          </div>
          
          {/* プログレスバー */}
          <div className="mb-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-white">
                {wizardSteps[currentStep]?.description}
              </span>
              <span className="text-sm text-blue-100">
                {Math.round(progress * 100)}% 完了
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5" data-testid="wizard-progress">
              <div
                className="bg-white h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ（スクロール可能） */}
      <div className="flex-1 overflow-y-auto bg-smarthr-neutral-100" role="main">
        <div className="max-w-4xl mx-auto p-6 sm:p-8">
          {error && (
            <Alert variant="error" className="mb-6 sm:mb-8">
              <div className="flex items-center">
                <span className="mr-2 text-xl">⚠️</span>
                {error}
              </div>
            </Alert>
          )}

          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
            <Wizard
              steps={wizardSteps}
              currentStep={currentStep}
              onStepChange={goToStep}
              onNext={nextStep}
              onPrev={prevStep}
              onComplete={handleWizardComplete}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              isLastStep={isLastStep}
              progress={progress}
            >
              {getCurrentStepComponent()}
            </Wizard>
          </div>
        </div>
      </div>
    </div>
  );
};
