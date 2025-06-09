import React from 'react';
import { SimulationChart, SimulationStats } from '../components/charts';
import { LifePlanSimulator, calculateStatistics } from '../utils/simulator';
import { createTestLifePlan } from '../utils/testLifePlan';
import { StorageManager } from '../utils/storage';
import { Button } from '../components/ui';

export function TestSimulationPage() {
  const [results, setResults] = React.useState<any>(null);
  const [stats, setStats] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const runTest = () => {
    try {
      console.log('=== シミュレーションテスト開始 ===');
      setError(null);
      
      const testPlan = createTestLifePlan();
      console.log('テストプラン:', testPlan);
      
      const simulator = new LifePlanSimulator(testPlan);
      const simulationResults = simulator.simulate();
      
      console.log('シミュレーション結果:', simulationResults);
      console.log('結果件数:', simulationResults.length);
      
      if (simulationResults.length > 0) {
        console.log('最初の年:', simulationResults[0]);
        console.log('最後の年:', simulationResults[simulationResults.length - 1]);
        
        // 統計も計算
        const calculatedStats = calculateStatistics(simulationResults);
        console.log('統計情報:', calculatedStats);
        
        setResults(simulationResults);
        setStats(calculatedStats);
      } else {
        setError('シミュレーション結果が生成されませんでした');
      }
      
      console.log('=== シミュレーションテスト終了 ===');
    } catch (error) {
      console.error('シミュレーションエラー:', error);
      setError(`エラー: ${error}`);
    }
  };

  const saveTestPlan = () => {
    try {
      const testPlan = createTestLifePlan();
      StorageManager.saveLifePlan(testPlan);
      alert('テストプランを保存しました。ホームページで確認してください。');
    } catch (error) {
      console.error('保存エラー:', error);
      setError(`保存エラー: ${error}`);
    }
  };

  const checkStorage = () => {
    try {
      const plans = StorageManager.getLifePlans();
      console.log('保存されているプラン:', plans);
      alert(`保存されているプラン数: ${plans.length}`);
    } catch (error) {
      console.error('ストレージ確認エラー:', error);
      setError(`ストレージ確認エラー: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            シミュレーションテストページ
          </h1>
          <div className="space-x-4">
            <Button onClick={runTest} variant="primary">
              テストシミュレーション実行
            </Button>
            <Button onClick={saveTestPlan} variant="secondary">
              テストプラン保存
            </Button>
            <Button onClick={checkStorage} variant="secondary">
              ストレージ確認
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium">エラー</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">シミュレーション結果</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">データ件数</h3>
                  <p className="text-2xl font-bold text-blue-600">{results.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">最終資産</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.finalAssets ? `${Math.round(stats.finalAssets / 10000)}万円` : '不明'}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900">最大資産</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats?.peakAssets ? `${Math.round(stats.peakAssets / 10000)}万円` : '不明'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">チャート</h3>
                  <SimulationChart results={results} height={400} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">統計情報</h3>
                  <SimulationStats results={results} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">生データ（最初の5件）</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">年</th>
                      <th className="px-4 py-2 text-left">年齢</th>
                      <th className="px-4 py-2 text-left">収入</th>
                      <th className="px-4 py-2 text-left">支出</th>
                      <th className="px-4 py-2 text-left">教育費</th>
                      <th className="px-4 py-2 text-left">累積資産</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 5).map((result: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{result.year}</td>
                        <td className="px-4 py-2">{result.age}歳</td>
                        <td className="px-4 py-2">{Math.round(result.income / 10000)}万円</td>
                        <td className="px-4 py-2">{Math.round(result.expenses / 10000)}万円</td>
                        <td className="px-4 py-2">{Math.round(result.educationCosts / 10000)}万円</td>
                        <td className="px-4 py-2">{Math.round(result.cumulativeAssets / 10000)}万円</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
