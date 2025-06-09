import { useNavigate, useLocation } from 'react-router-dom';
import { LifePlanWizard } from '../components/LifePlanWizard';
import { Button } from '../components/ui';
import { useLifePlans } from '../hooks';
import type { LifePlan } from '../types';

export function WizardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveLifePlan } = useLifePlans();
  
  // location.stateから編集対象のプランを取得
  const editingPlan = location.state?.editingPlan as LifePlan | undefined;

  const handleSavePlan = (plan: LifePlan) => {
    saveLifePlan(plan);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-smarthr-neutral-50">
      {/* ナビゲーションヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-smarthr-black hover:text-smarthr-blue transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-smarthr-blue to-smarthr-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">💰</span>
                </div>
                <h1 className="text-xl font-bold">
                  ライフプランニングシミュレーター
                </h1>
              </button>
            </div>
            <nav className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="shadow-md hover:shadow-lg transition-all duration-200"
              >
                <span className="mr-2">⬅️</span>
                ホームに戻る
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* ウィザードコンテンツ */}
      <div className="min-h-[calc(100vh-4rem)]">
        <LifePlanWizard
          onComplete={handleSavePlan}
          onCancel={handleCancel}
          initialData={editingPlan}
        />
      </div>
    </div>
  );
}
