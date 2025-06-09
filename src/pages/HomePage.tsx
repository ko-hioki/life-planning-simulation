import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from '../components/ui';
import { SimulationChart, SimulationStats } from '../components/charts';
import { useLifePlans } from '../hooks';
import { LifePlanSimulator } from '../utils/simulator';
import { createTestLifePlan } from '../utils/testLifePlan';
import { StorageManager } from '../utils/storage';
import type { LifePlan } from '../types';

export function HomePage() {
  const navigate = useNavigate();
  const { lifePlans, isLoading, error, deleteLifePlan } = useLifePlans();
  const [selectedPlan, setSelectedPlan] = useState<LifePlan | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // モーダル開閉時にbodyのスクロールを制御
  useEffect(() => {
    if (showDetailModal) {
      // スクロールバーの幅を計算
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // モーダル表示時はbodyのスクロールを無効化
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`; // スクロールバーの幅を調整
    } else {
      // モーダル非表示時は元に戻す
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showDetailModal]);

  // ESCキーでモーダルを閉じる & フォーカストラップ
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDetailModal) {
        setShowDetailModal(false);
      }
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (!showDetailModal || event.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          event.preventDefault();
        }
      }
    };

    if (showDetailModal) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('keydown', handleTabKey);
      
      // 初期フォーカスを閉じるボタンに設定
      setTimeout(() => {
        const closeButton = document.querySelector('[aria-label="モーダルを閉じる"]') as HTMLElement;
        closeButton?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [showDetailModal]);

  // 初回アクセス時にサンプルデータがない場合は作成
  useEffect(() => {
    if (!isLoading && lifePlans.length === 0) {
      try {
        const existingPlans = StorageManager.getLifePlans();
        if (existingPlans.length === 0) {
          // サンプルプランを作成
          const samplePlan = createTestLifePlan();
          samplePlan.id = 'sample-plan';
          samplePlan.name = 'サンプルプラン（30歳・夫婦・子供2人）';
          StorageManager.saveLifePlan(samplePlan);
          window.location.reload(); // データ更新のためリロード
        }
      } catch (error) {
        console.error('サンプルプラン作成エラー:', error);
      }
    }
  }, [isLoading, lifePlans.length]);

  // 選択されたプランのシミュレーション結果を計算
  const simulationResults = useMemo(() => {
    if (!selectedPlan) return null;
    const simulator = new LifePlanSimulator(selectedPlan);
    return simulator.simulate();
  }, [selectedPlan]);

  const handlePlanSelect = (plan: LifePlan) => {
    setSelectedPlan(plan);
    setShowDetailModal(true);
  };

  const handleCreatePlan = () => {
    navigate('/wizard');
  };

  const handleEditPlan = (plan: LifePlan) => {
    navigate('/wizard', { state: { editingPlan: plan } });
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-smarthr-blue mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-gray-100 animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-smarthr-black mb-2">読み込み中</h2>
          <p className="text-gray-600">データを準備しています...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 詳細モーダル */}
      {selectedPlan && showDetailModal && simulationResults && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-1 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
        >
          {/* 背景オーバーレイ - より濃い背景に変更 */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-all duration-300"
            onClick={() => setShowDetailModal(false)}
            aria-hidden="true"
          />
          
          {/* モーダルコンテンツ */}
          <div 
            className="relative w-full max-w-6xl h-[92vh] sm:h-[90vh] max-h-[92vh] sm:max-h-[90vh] bg-white rounded-lg sm:rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100 flex flex-col overflow-hidden animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー（固定） */}
            <div className="flex-shrink-0 bg-white px-3 sm:px-6 py-3 sm:py-5 border-b border-gray-200 rounded-t-lg sm:rounded-t-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                <h2 id="detail-modal-title" className="text-base sm:text-2xl font-bold text-gray-900 line-clamp-2 flex-grow pr-2">
                  {selectedPlan.name}
                </h2>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowDetailModal(false)}
                  className="rounded-full w-8 h-8 sm:w-9 sm:h-9 p-0 flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0 text-gray-500 hover:text-gray-700"
                  aria-label="モーダルを閉じる"
                >
                  <span className="sr-only">閉じる</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
            
            {/* コンテンツエリア（スクロール可能） - スクロール領域を明確に制御 */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-white px-3 sm:px-6 py-3 sm:py-6 space-y-4 sm:space-y-6 custom-scrollbar">
              <SimulationStats results={simulationResults} lifePlan={selectedPlan} />
              <SimulationChart results={simulationResults} />
              {/* スクロール用の余白を追加 */}
              <div className="h-4 sm:h-6"></div>
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-smarthr-blue to-smarthr-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">💰</span>
              </div>
              <h1 className="text-xl font-bold text-smarthr-black">
                ライフプランニングシミュレーター
              </h1>
            </div>
            <nav className="flex space-x-3">
              <Button
                variant="primary"
                onClick={handleCreatePlan}
                className="shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span className="mr-2">✨</span>
                新規プラン作成
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="error" className="mb-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <span className="mr-2 text-xl">⚠️</span>
              {error}
            </div>
          </Alert>
        )}

        {/* ウェルカムメッセージ */}
        {lifePlans.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-4xl">📊</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  あなたの未来を<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-black">
                    シミュレーション
                  </span>
                  しましょう
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  収入、支出、教育費などを入力して<br />
                  将来の資産推移を美しいグラフで確認できます
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">簡単入力</h3>
                  <p className="text-sm text-gray-600">ウィザード形式で段階的に情報を入力</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">詳細分析</h3>
                  <p className="text-sm text-gray-600">教育費や年金を考慮した精密計算</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">賢いアドバイス</h3>
                  <p className="text-sm text-gray-600">リスク分析と改善提案を自動生成</p>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleCreatePlan}
                className="rounded-full px-12 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-3">🚀</span>
                最初のプランを作成する
              </Button>
            </div>
          </div>
        )}

        {/* Life Plans Grid */}
        {lifePlans.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">あなたのライフプラン</h2>
                <p className="text-gray-600">{lifePlans.length}件のプランが保存されています</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    // プランの並び替えやフィルタリング機能を追加予定
                  }}
                  className="flex items-center space-x-2"
                >
                  <span>📊</span>
                  <span>並び替え</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lifePlans.map((plan) => {
                const planAge = new Date().getFullYear() - plan.user.birthYear;
                const simulationYears = plan.simulationParameters.simulationEndYear - plan.simulationParameters.simulationStartYear;
                
                return (
                  <Card
                    key={plan.id}
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 border-2 border-transparent hover:border-blue-200"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <div className="p-6">
                      {/* プランヘッダー */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {plan.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <span className="mr-1">👤</span>
                              {plan.user.name} ({planAge}歳)
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                      </div>

                      {/* プラン詳細 */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <span className="mr-1">📅</span>
                            シミュレーション期間
                          </span>
                          <span className="font-medium text-gray-900">{simulationYears}年間</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <span className="mr-1">🎯</span>
                            退職予定年齢
                          </span>
                          <span className="font-medium text-gray-900">{plan.user.retirementAge}歳</span>
                        </div>

                        {plan.spouse && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                              <span className="mr-1">👥</span>
                              配偶者
                            </span>
                            <span className="font-medium text-gray-900">{plan.spouse.name}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center">
                            <span className="mr-1">🔄</span>
                            最終更新
                          </span>
                          <span className="font-medium text-gray-900">
                            {plan.updatedAt.toLocaleDateString('ja-JP', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={(e) => {
                            e?.stopPropagation();
                            handlePlanSelect(plan);
                          }}
                          className="flex-1 group-hover:shadow-md transition-shadow"
                        >
                          <span className="mr-1">📊</span>
                          詳細
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleEditPlan(plan);
                          }}
                          className="group-hover:shadow-md transition-shadow"
                          aria-label={`${plan.name}を編集`}
                        >
                          <span className="mr-1">✏️</span>
                          編集
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={(e) => {
                            e?.stopPropagation();
                            if (window.confirm(`「${plan.name}」を削除しますか？この操作は取り消せません。`)) {
                              deleteLifePlan(plan.id);
                              if (selectedPlan?.id === plan.id) {
                                setSelectedPlan(null);
                                setShowDetailModal(false);
                              }
                            }
                          }}
                          className="group-hover:shadow-md transition-shadow"
                          aria-label={`${plan.name}を削除`}
                        >
                          <span className="mr-1">🗑️</span>
                          削除
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            © 2025 ライフプランニングシミュレーター. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
