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
      const lifePlan: LifePlan = {
        id: initialData?.id || `plan-${Date.now()}`,
        name: `${formData.basicInfo.name || 'ユーザー'}のライフプラン`,
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
        user: {
          name: formData.basicInfo.name || '',
          birthYear: formData.basicInfo.birthYear || new Date().getFullYear() - 30,
          retirementAge: formData.basicInfo.retirementAge || 65,
        },
        spouse: formData.basicInfo.hasSpouse && formData.basicInfo.spouseBirthYear ? {
          name: initialData?.spouse?.name || '配偶者',
          birthYear: formData.basicInfo.spouseBirthYear,
          retirementAge: initialData?.spouse?.retirementAge || 65,
          workStatus: formData.income.spouseIncome && formData.income.spouseIncome > 0 ? 'working' : 'notWorking',
        } : undefined,
        children: formData.children,
        income: {
          userIncome: formData.income.userIncome || 0,
          spouseIncome: formData.income.spouseIncome || 0,
          otherIncome: formData.income.otherIncome || 0,
          incomeGrowthRate: formData.income.incomeGrowthRate || 0.02,
        },
        expenses: {
          livingExpenses: formData.expenses.livingExpenses || 0,
          housingExpenses: formData.expenses.housingExpenses || 0,
          otherExpenses: formData.expenses.otherExpenses || 0,
          expenseGrowthRate: formData.expenses.expenseGrowthRate || 0.02,
        },
        assets: {
          savings: formData.basicInfo.currentSavings || 0,
          investments: initialData?.assets?.investments || 0,
          realEstate: initialData?.assets?.realEstate || 0,
          other: initialData?.assets?.other || 0,
        },
        pension: {
          nationalPension: initialData?.pension?.nationalPension || 0,
          employeePension: initialData?.pension?.employeePension || 0,
          corporatePension: initialData?.pension?.corporatePension || 0,
          privatePension: initialData?.pension?.privatePension || 0,
        },
        simulationParameters: {
          simulationStartYear: formData.simulationSettings.simulationStartYear || new Date().getFullYear(),
          simulationEndYear: formData.simulationSettings.simulationEndYear || new Date().getFullYear() + 50,
          inflationRate: formData.simulationSettings.inflationRate || 0.02,
          investmentReturnRate: formData.simulationSettings.investmentReturnRate || 0.04,
        },
      };

      console.log(initialData ? 'ライフプラン更新:' : '新規ライフプラン作成:', lifePlan);
      onComplete(lifePlan);
    } catch (err) {
      setError('プランの作成に失敗しました');
      console.error('Error creating life plan:', err);
    }
  }, [formData, onComplete, initialData]);

  // 現在のステップコンポーネントを取得
  const getCurrentStepComponent = () => {
    const step = wizardSteps[currentStep];
    
    switch (step.id) {
      case 'basic-info':
        return (
          <BasicInfoForm
            data={formData.basicInfo}
            onUpdate={handleBasicInfoUpdate}
            onNext={() => handleStepNext(currentStep)}
            onCancel={onCancel}
          />
        );
      
      case 'income':
        return (
          <IncomeInfoForm
            data={formData.income}
            onUpdate={handleIncomeUpdate}
            onNext={() => handleStepNext(currentStep)}
            onPrev={prevStep}
          />
        );
      
      case 'expenses':
        return (
          <ExpenseInfoForm
            data={formData.expenses}
            onUpdate={handleExpensesUpdate}
            onNext={() => handleStepNext(currentStep)}
            onPrev={prevStep}
          />
        );
      
      case 'children':
        return (
          <ChildrenInfoForm
            data={formData.children}
            onUpdate={handleChildrenUpdate}
            onNext={() => handleStepNext(currentStep)}
            onPrev={prevStep}
          />
        );
      
      case 'simulation':
        return (
          <SimulationSettingsForm
            data={formData.simulationSettings}
            onUpdate={handleSimulationSettingsUpdate}
            onNext={() => handleStepNext(currentStep)}
            onPrev={prevStep}
          />
        );
      
      case 'review':
        return (
          <ReviewForm
            basicInfo={formData.basicInfo}
            income={formData.income}
            expenses={formData.expenses}
            children={formData.children}
            simulationSettings={formData.simulationSettings}
            onComplete={handleWizardComplete}
            onPrev={prevStep}
            onEdit={handleEditStep}
          />
        );
      
      default:
        // 未実装のステップのプレースホルダー
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Alert variant="info" className="mb-6">
              このステップは実装中です。
            </Alert>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
              <div className="flex justify-between pt-6">
                <Button
                  variant="secondary"
                  onClick={prevStep}
                  disabled={!canGoPrev}
                >
                  前へ
                </Button>
                <Button
                  variant="primary"
                  onClick={isLastStep ? handleWizardComplete : nextStep}
                  disabled={!canGoNext && !isLastStep}
                >
                  {isLastStep ? (initialData ? '更新' : '完了') : '次へ'}
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* ウィザードヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">{wizardSteps[currentStep]?.icon || '📋'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {initialData ? 'ライフプラン編集' : 'ライフプラン作成'}
              </h1>
              <p className="text-blue-100 text-sm">
                ステップ {currentStep + 1} / {wizardSteps.length}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={onCancel}
            className="text-gray-700 bg-white hover:bg-gray-50"
          >
            <span className="mr-1">✕</span>
            キャンセル
          </Button>
        </div>
        
        {/* プログレスバー */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-100">
              {wizardSteps[currentStep]?.title}
            </span>
            <span className="text-sm text-blue-200">
              {Math.round(progress * 100)}% 完了
            </span>
          </div>
          <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <p className="text-blue-100 text-sm">
          {wizardSteps[currentStep]?.description}
        </p>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white rounded-b-2xl shadow-xl">
        <div className="p-6">
          {error && (
            <Alert variant="error" className="mb-6">
              <div className="flex items-center">
                <span className="mr-2 text-xl">⚠️</span>
                {error}
              </div>
            </Alert>
          )}

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
  );
};
