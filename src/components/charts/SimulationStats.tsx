import React from 'react';
import { Card } from '../ui';
import type { SimulationResult } from '../../types';
import { calculateStatistics } from '../../utils/simulator';

interface StatisticCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: 'default' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  subtitle,
  color = 'default',
  icon,
}) => {
  const colorClasses = {
    default: 'bg-white text-gray-900 border-gray-200 shadow-sm',
    success: 'bg-green-50 text-green-900 border-green-200 shadow-sm',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 shadow-sm',
    error: 'bg-red-50 text-red-900 border-red-200 shadow-sm',
  };

  return (
    <Card className={`p-6 relative z-10 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-75">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-60 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 opacity-50">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

interface SimulationStatsProps {
  results: SimulationResult[];
  lifePlan?: {
    name: string;
    user: { birthYear: number; retirementAge: number };
  };
}

export const SimulationStats: React.FC<SimulationStatsProps> = ({
  results,
  lifePlan,
}) => {
  const stats = calculateStatistics(results);
  
  const formatCurrency = (amount: number) => {
    return `${(amount / 10000).toLocaleString()}万円`;
  };

  const retirementYear = lifePlan
    ? lifePlan.user.birthYear + lifePlan.user.retirementAge
    : null;
  
  const retirementAssets = retirementYear
    ? results.find(r => r.year === retirementYear)?.cumulativeAssets
    : null;

  const finalYear = results[results.length - 1]?.year;
  const finalAge = lifePlan && finalYear
    ? finalYear - lifePlan.user.birthYear
    : null;

  // アイコン用のSVGコンポーネント
  const TrendingUpIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const TrendingDownIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  );

  const DollarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );

  const HomeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  // 詳細統計の計算
  const detailedStats = {
    // 総収入・支出
    totalIncome: stats.totalIncome,
    totalExpenses: stats.totalExpenses,
    totalEducationCosts: stats.totalEducationCosts,
    
    // 年間平均
    averageAnnualIncome: stats.totalIncome / results.length,
    averageAnnualExpenses: stats.totalExpenses / results.length,
    averageAnnualSavings: (stats.totalIncome - stats.totalExpenses) / results.length,
    
    // 最高・最低
    peakAssets: stats.peakAssets,
    minimumAssets: stats.minAssets,
    
    // 退職後の生活
    retirementYears: results.filter(r => r.age >= (lifePlan?.user.retirementAge || 65)).length,
    preRetirementAssets: results.find(r => r.age === (lifePlan?.user.retirementAge || 65))?.cumulativeAssets || 0,
    
    // 資産枯渇リスク
    assetsDepletionYear: results.find(r => r.cumulativeAssets <= 0)?.year,
    yearsUntilDepletion: results.find(r => r.cumulativeAssets <= 0) ? 
      (results.find(r => r.cumulativeAssets <= 0)?.year || 0) - new Date().getFullYear() : null,
  };

  // 健全性評価
  const getFinancialHealthColor = (ratio: number): 'success' | 'warning' | 'error' => {
    if (ratio >= 0.8) return 'success';
    if (ratio >= 0.6) return 'warning';
    return 'error';
  };

  // 退職準備度評価
  const retirementReadiness = detailedStats.retirementYears > 0 ? 
    detailedStats.preRetirementAssets / (detailedStats.averageAnnualExpenses * detailedStats.retirementYears) : 1;
  const retirementColor = getFinancialHealthColor(retirementReadiness);

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          title="最終資産"
          value={formatCurrency(stats.finalAssets)}
          subtitle={finalAge ? `${finalAge}歳時点` : ''}
          color={stats.finalAssets >= 0 ? 'success' : 'error'}
          icon={stats.finalAssets >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
        />

        <StatisticCard
          title="最大資産"
          value={formatCurrency(stats.peakAssets)}
          subtitle="シミュレーション期間中"
          color="success"
          icon={<TrendingUpIcon />}
        />

        {retirementAssets !== null && retirementAssets !== undefined && (
          <StatisticCard
            title="退職時資産"
            value={formatCurrency(retirementAssets)}
            subtitle={`${lifePlan?.user.retirementAge}歳時点`}
            color={retirementAssets >= 0 ? 'success' : 'warning'}
            icon={<HomeIcon />}
          />
        )}

        <StatisticCard
          title="総収入"
          value={formatCurrency(stats.totalIncome)}
          subtitle={`${stats.simulationYears}年間`}
          color="default"
          icon={<DollarIcon />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticCard
          title="総支出"
          value={formatCurrency(stats.totalExpenses)}
          subtitle="生活費・住居費など"
          color="default"
        />

        <StatisticCard
          title="総教育費"
          value={formatCurrency(stats.totalEducationCosts)}
          subtitle="子供の教育費総額"
          color="warning"
        />

        <StatisticCard
          title="児童手当総額"
          value={formatCurrency(stats.totalChildAllowance)}
          subtitle="受給見込み総額"
          color="success"
        />
      </div>

      {stats.negativeYears > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                注意: 資産がマイナスになる期間があります
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {stats.negativeYears}年間、資産がマイナスになる見込みです。支出の見直しを検討してください。
              </p>
            </div>
          </div>
        </Card>
      )}

      {stats.minAssets < 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                最低資産: {formatCurrency(stats.minAssets)}
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                一時的に資産がマイナスになる可能性があります。緊急資金の準備を検討してください。
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 詳細分析セクション */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard
            title="年間平均収入"
            value={formatCurrency(detailedStats.averageAnnualIncome)}
            subtitle="シミュレーション期間中"
            color="default"
          />
          
          <StatisticCard
            title="年間平均支出"
            value={formatCurrency(detailedStats.averageAnnualExpenses)}
            subtitle="生活費・教育費含む"
            color="default"
          />
          
          <StatisticCard
            title="年間平均貯蓄"
            value={formatCurrency(detailedStats.averageAnnualSavings)}
            subtitle="収入 - 支出"
            color={detailedStats.averageAnnualSavings >= 0 ? 'success' : 'error'}
          />
          
          <StatisticCard
            title="退職準備度"
            value={`${(retirementReadiness * 100).toFixed(1)}%`}
            subtitle="退職後の生活資金充足率"
            color={retirementColor}
          />
        </div>
      </div>

      {/* リスク分析 */}
      {detailedStats.assetsDepletionYear && (
        <Card className="mt-6 p-6 bg-red-50 border-red-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">資産枯渇警告</h3>
              <p className="mt-2 text-sm text-red-700">
                現在の計画では、{detailedStats.assetsDepletionYear}年（約{detailedStats.yearsUntilDepletion}年後）に資産が枯渇する可能性があります。
              </p>
              <div className="mt-4">
                <h4 className="font-medium text-red-800">対策案:</h4>
                <ul className="mt-2 list-disc list-inside text-sm text-red-700 space-y-1">
                  <li>支出の見直しと削減</li>
                  <li>副収入の確保</li>
                  <li>投資収益率の向上</li>
                  <li>退職年齢の延長検討</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 健全性評価 */}
      {!detailedStats.assetsDepletionYear && detailedStats.retirementYears > 0 && (
        <Card className="mt-6 p-6 bg-green-50 border-green-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-green-800">良好な財務状況</h3>
              <p className="mt-2 text-sm text-green-700">
                現在の計画では、退職後も十分な資産を維持できる見込みです。
                退職時の資産は{formatCurrency(detailedStats.preRetirementAssets)}となり、
                {detailedStats.retirementYears}年間の退職後生活をサポートできます。
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
