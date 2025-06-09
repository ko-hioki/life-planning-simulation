import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SimulationResult, ComparisonData } from '../../types';

// 新しいコンポーネントをエクスポート
export { SimulationChart, AssetChart } from './SimulationChart';
export { SimulationStats } from './SimulationStats';

// 数値フォーマット用ヘルパー
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    notation: value >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: 0,
  }).format(value);
};

// Assets Trend Chart (資産推移グラフ)
interface AssetsTrendChartProps {
  data: SimulationResult[];
  height?: number;
  showGridLines?: boolean;
}

export const AssetsTrendChart: React.FC<AssetsTrendChartProps> = ({
  data,
  height = 400,
  showGridLines = true,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey="year" 
          type="number"
          scale="linear"
          domain={['dataMin', 'dataMax']}
        />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), '累積資産']}
          labelFormatter={(year: number) => `${year}年`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="cumulativeAssets"
          stroke="#2563eb"
          strokeWidth={2}
          name="累積資産"
          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Cash Flow Chart (収支グラフ)
interface CashFlowChartProps {
  data: SimulationResult[];
  height?: number;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  data,
  height = 400,
}) => {
  const chartData = data.map(item => ({
    ...item,
    positiveFlow: item.netCashFlow > 0 ? item.netCashFlow : 0,
    negativeFlow: item.netCashFlow < 0 ? Math.abs(item.netCashFlow) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip 
          formatter={(value: number, name: string) => [
            formatCurrency(value), 
            name === 'positiveFlow' ? '黒字' : '赤字'
          ]}
          labelFormatter={(year: number) => `${year}年`}
        />
        <Legend />
        <Bar dataKey="positiveFlow" fill="#10b981" name="黒字" />
        <Bar dataKey="negativeFlow" fill="#ef4444" name="赤字" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Income vs Expenses Chart (収入・支出比較グラフ)
interface IncomeExpensesChartProps {
  data: SimulationResult[];
  height?: number;
}

export const IncomeExpensesChart: React.FC<IncomeExpensesChartProps> = ({
  data,
  height = 400,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip 
          formatter={(value: number, name: string) => [formatCurrency(value), name]}
          labelFormatter={(year: number) => `${year}年`}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="income"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
          name="収入"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stackId="2"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.6}
          name="支出"
        />
        <Area
          type="monotone"
          dataKey="educationCosts"
          stackId="2"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.6}
          name="教育費"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Education Costs Chart (教育費グラフ)
interface EducationCostsChartProps {
  data: SimulationResult[];
  height?: number;
}

export const EducationCostsChart: React.FC<EducationCostsChartProps> = ({
  data,
  height = 400,
}) => {
  const filteredData = data.filter(item => item.educationCosts > 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), '教育費']}
          labelFormatter={(year: number) => `${year}年`}
        />
        <Legend />
        <Bar dataKey="educationCosts" fill="#f59e0b" name="教育費" />
        <Bar dataKey="childAllowance" fill="#06b6d4" name="児童手当" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Comparison Chart (複数プラン比較グラフ)
interface ComparisonChartProps {
  data: ComparisonData[];
  height?: number;
  mode?: 'overlay' | 'parallel';
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  height = 400,
  mode = 'overlay',
}) => {
  if (mode === 'overlay') {
    // 重ね合わせ表示
    const allYears = Array.from(
      new Set(data.flatMap(plan => plan.results.map(r => r.year)))
    ).sort();

    const chartData = allYears.map(year => {
      const yearData: Record<string, number | null> = { year };
      data.forEach(plan => {
        const result = plan.results.find(r => r.year === year);
        yearData[plan.planId] = result?.cumulativeAssets || null;
      });
      return yearData;
    });

    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip 
            formatter={(value: string | number | (string | number)[], name: string) => {
              if (value === null || value === undefined) return ['データなし', name];
              const numValue = typeof value === 'number' ? value : Number(value);
              return [formatCurrency(numValue), data.find(d => d.planId === name)?.planName || name];
            }}
            labelFormatter={(year: number) => `${year}年`}
          />
          <Legend 
            formatter={(value) => data.find(d => d.planId === value)?.planName || value}
          />
          {data.map((plan) => (
            <Line
              key={plan.planId}
              type="monotone"
              dataKey={plan.planId}
              stroke={plan.color}
              strokeWidth={2}
              name={plan.planName}
              connectNulls={false}
              dot={{ fill: plan.color, strokeWidth: 2, r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  } else {
    // 並列表示（複数のチャートを縦に配置）
    return (
      <div className="space-y-6">
        {data.map((plan) => (
          <div key={plan.planId} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4" style={{ color: plan.color }}>
              {plan.planName}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={plan.results} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '累積資産']}
                  labelFormatter={(year: number) => `${year}年`}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeAssets"
                  stroke={plan.color}
                  strokeWidth={2}
                  name="累積資産"
                  dot={{ fill: plan.color, strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    );
  }
};

// Asset Allocation Pie Chart (資産配分円グラフ)
interface AssetAllocationChartProps {
  data: {
    savings: number;
    investments: number;
    realEstate: number;
    other: number;
  };
  height?: number;
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({
  data,
  height = 300,
}) => {
  const chartData = [
    { name: '預貯金', value: data.savings, color: '#3b82f6' },
    { name: '投資資産', value: data.investments, color: '#10b981' },
    { name: '不動産', value: data.realEstate, color: '#f59e0b' },
    { name: 'その他', value: data.other, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Chart Container Component
interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};
