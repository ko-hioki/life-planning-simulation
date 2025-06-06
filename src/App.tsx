import { useState, useMemo } from 'react';
import { Card, Button, Alert } from './components/ui';
import { LifePlanWizard } from './components/LifePlanWizard';
import { SimulationChart, SimulationStats } from './components/charts';
import { useLifePlans } from './hooks';
import { LifePlanSimulator } from './utils/simulator';
import type { LifePlan } from './types';

function App() {
  const { lifePlans, isLoading, error, saveLifePlan, deleteLifePlan } = useLifePlans();
  const [selectedPlan, setSelectedPlan] = useState<LifePlan | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LifePlan | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
    setEditingPlan(null);
    setShowCreateForm(true);
  };

  const handleSavePlan = (plan: LifePlan) => {
    saveLifePlan(plan);
    setShowCreateForm(false);
    setEditingPlan(null);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingPlan(null);
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-100 animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">読み込み中</h2>
          <p className="text-gray-500">データを準備しています...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ウィザード表示 */}
      {showCreateForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wizard-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
            <LifePlanWizard
              onComplete={handleSavePlan}
              onCancel={handleCancelForm}
              initialData={editingPlan || undefined}
            />
          </div>
        </div>
      )}

      {/* 詳細モーダル */}
      {selectedPlan && showDetailModal && simulationResults && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 id="detail-modal-title" className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-2">
                {selectedPlan.name}
              </h2>
              <Button 
                variant="secondary" 
                onClick={() => setShowDetailModal(false)}
                className="rounded-full w-8 h-8 p-0 flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
                aria-label="モーダルを閉じる"
              >
                <span className="sr-only">閉じる</span>
                ✕
              </Button>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              <SimulationStats results={simulationResults} lifePlan={selectedPlan} />
              <SimulationChart results={simulationResults} />
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">💰</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ライフプランニングシミュレーター
              </h1>
            </div>
            <nav className="flex space-x-3">
              <Button
                variant="primary"
                onClick={handleCreatePlan}
                className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
        {lifePlans.length === 0 && !showCreateForm && (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-4xl">📊</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  あなたの未来を<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
        {lifePlans.length > 0 && !showCreateForm && (
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
                            setEditingPlan(plan);
                            setShowCreateForm(true);
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

export default App;
