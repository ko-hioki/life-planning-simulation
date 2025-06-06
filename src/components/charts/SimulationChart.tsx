import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SimulationResult } from '../../types';

interface SimulationChartProps {
  results: SimulationResult[];
  showIncome?: boolean;
  showExpenses?: boolean;
  showAssets?: boolean;
  showNetCashFlow?: boolean;
  height?: number;
}

export const SimulationChart: React.FC<SimulationChartProps> = ({
  results,
  showIncome = true,
  showExpenses = true,
  showAssets = true,
  showNetCashFlow = false,
  height = 400,
}) => {
  // データを万円単位に変換
  const chartData = results.map(result => ({
    year: result.year,
    age: `${result.age}歳`,
    income: Math.round(result.income / 10000),
    expenses: Math.round(result.expenses / 10000),
    educationCosts: Math.round(result.educationCosts / 10000),
    assets: Math.round(result.cumulativeAssets / 10000),
    netCashFlow: Math.round(result.netCashFlow / 10000),
  }));

  const formatYAxis = (value: number) => {
    return `${value.toLocaleString()}万円`;
  };

  const formatTooltip = (value: number, name: string) => {
    const labels: Record<string, string> = {
      income: '収入',
      expenses: '支出',
      educationCosts: '教育費',
      assets: '総資産',
      netCashFlow: '年間収支',
    };
    return [`${value.toLocaleString()}万円`, labels[name] || name];
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(label) => `${label}年`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          
          {showIncome && (
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981' }}
              name="収入"
            />
          )}
          
          {showExpenses && (
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: '#f59e0b' }}
              name="支出"
            />
          )}
          
          {showAssets && (
            <Line
              type="monotone"
              dataKey="assets"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: '#3b82f6' }}
              name="総資産"
            />
          )}
          
          {showNetCashFlow && (
            <Line
              type="monotone"
              dataKey="netCashFlow"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: '#8b5cf6' }}
              name="年間収支"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 資産推移のみを表示するシンプルなチャート
 */
export const AssetChart: React.FC<{ results: SimulationResult[]; height?: number }> = ({
  results,
  height = 300,
}) => {
  return (
    <SimulationChart
      results={results}
      showIncome={false}
      showExpenses={false}
      showAssets={true}
      showNetCashFlow={false}
      height={height}
    />
  );
};

/**
 * 収支比較チャート
 */
export const CashFlowChart: React.FC<{ results: SimulationResult[]; height?: number }> = ({
  results,
  height = 300,
}) => {
  return (
    <SimulationChart
      results={results}
      showIncome={true}
      showExpenses={true}
      showAssets={false}
      showNetCashFlow={true}
      height={height}
    />
  );
};
