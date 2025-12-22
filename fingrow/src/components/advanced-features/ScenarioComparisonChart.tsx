'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { InvestmentScenario, ScenarioDifferences } from '@/lib/advanced-features/types';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface ScenarioComparisonChartProps {
  baseScenario: InvestmentScenario;
  alternativeScenario: InvestmentScenario;
  differences: ScenarioDifferences;
}

export default function ScenarioComparisonChart({
  baseScenario,
  alternativeScenario,
  differences
}: ScenarioComparisonChartProps) {
  const [showInvested, setShowInvested] = useState(false);

  // Prepare chart data by merging both scenarios
  const chartData = baseScenario.projections.map((baseProj, index) => {
    const altProj = alternativeScenario.projections[index];
    return {
      month: baseProj.month,
      baseValue: Math.round(baseProj.projectedValue),
      altValue: Math.round(altProj.projectedValue),
      baseInvested: Math.round(baseProj.cumulativeInvested),
      altInvested: Math.round(altProj.cumulativeInvested),
      difference: Math.round(altProj.projectedValue - baseProj.projectedValue)
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const monthLabel = label <= 12 ? `Month ${label}` : `Year ${Math.floor(label / 12)}, Month ${label % 12 || 12}`;
      
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{monthLabel}</p>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center space-x-4">
              <span className="text-blue-400">Current Strategy:</span>
              <span className="text-white font-medium">₹{data.baseValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center space-x-4">
              <span className="text-purple-400">Alternative:</span>
              <span className="text-white font-medium">₹{data.altValue.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-600 my-2"></div>
            <div className="flex justify-between items-center space-x-4">
              <span className="text-gray-300">Difference:</span>
              <span className={`font-medium ${data.difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.difference >= 0 ? '+' : ''}₹{data.difference.toLocaleString()}
              </span>
            </div>
            
            {showInvested && (
              <>
                <div className="border-t border-gray-600 my-2"></div>
                <div className="flex justify-between items-center space-x-4">
                  <span className="text-gray-400 text-xs">Invested (Current):</span>
                  <span className="text-gray-300 text-xs">₹{data.baseInvested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center space-x-4">
                  <span className="text-gray-400 text-xs">Invested (Alt):</span>
                  <span className="text-gray-300 text-xs">₹{data.altInvested.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Final Corpus Difference */}
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Final Corpus Difference</span>
            {differences.finalCorpusDiff >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-400" />
            )}
          </div>
          <p className={`text-2xl font-bold ${differences.finalCorpusDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {differences.finalCorpusDiff >= 0 ? '+' : ''}₹{Math.abs(differences.finalCorpusDiff).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {differences.percentageImprovement >= 0 ? '+' : ''}{differences.percentageImprovement.toFixed(1)}% change
          </p>
        </div>

        {/* Investment Difference */}
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Investment Difference</span>
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {differences.totalInvestedDiff >= 0 ? '+' : ''}₹{Math.abs(differences.totalInvestedDiff).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {differences.totalInvestedDiff >= 0 ? 'More' : 'Less'} investment required
          </p>
        </div>

        {/* Breakeven Point */}
        <div className="bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Breakeven Point</span>
            <TrendingUp className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400">
            {differences.breakEvenMonth ? `${differences.breakEvenMonth} months` : 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {differences.breakEvenMonth 
              ? `${Math.floor(differences.breakEvenMonth / 12)}y ${differences.breakEvenMonth % 12}m`
              : 'No crossover point'
            }
          </p>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Projection Comparison</h3>
        <button
          onClick={() => setShowInvested(!showInvested)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showInvested ? 'Hide' : 'Show'} Investment Amounts
        </button>
      </div>

      {/* Main Chart */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Breakeven reference line */}
            {differences.breakEvenMonth && (
              <ReferenceLine 
                x={differences.breakEvenMonth} 
                stroke="#10B981" 
                strokeDasharray="3 3"
                label={{ value: 'Breakeven', fill: '#10B981', position: 'top' }}
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="baseValue" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Current Strategy"
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="altValue" 
              stroke="#A855F7" 
              strokeWidth={2}
              name="Alternative Strategy"
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Educational Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-200">
            <strong>Simulated Projections:</strong> These projections assume a 12% annual return and are for educational purposes only. 
            Actual returns may vary significantly based on market conditions and investment choices.
          </p>
        </div>
      </div>
    </div>
  );
}