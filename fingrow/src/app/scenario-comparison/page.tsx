'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import ScenarioComparisonChart from '@/components/advanced-features/ScenarioComparisonChart';
import { InvestmentRules, ScenarioComparison } from '@/lib/advanced-features/types';
import { 
  Calculator, 
  TrendingUp, 
  Settings, 
  ArrowLeft,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

export default function ScenarioComparisonPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Base rules (current strategy)
  const [baseRules, setBaseRules] = useState<InvestmentRules>({
    roundUpEnabled: false,
    roundUpMultiplier: 1,
    percentageRule: 10,
    sweepThreshold: 0,
    sweepPercentage: 0
  });

  // Alternative rules (modified strategy)
  const [alternativeRules, setAlternativeRules] = useState<InvestmentRules>({
    roundUpEnabled: true,
    roundUpMultiplier: 2,
    percentageRule: 20,
    sweepThreshold: 5000,
    sweepPercentage: 50
  });

  useEffect(() => {
    // Get user data from localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  const handleCompareScenarios = async () => {
    if (!user) {
      setError('User data not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scenario-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseRules,
          alternativeRules,
          userIncome: user.monthlyIncome || 75000,
          userExpenses: user.monthlyExpenses || 55000,
          projectionMonths: 60
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate comparison');
      }

      setComparison(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setBaseRules({
      roundUpEnabled: false,
      roundUpMultiplier: 1,
      percentageRule: 10,
      sweepThreshold: 0,
      sweepPercentage: 0
    });
    setAlternativeRules({
      roundUpEnabled: true,
      roundUpMultiplier: 2,
      percentageRule: 20,
      sweepThreshold: 5000,
      sweepPercentage: 50
    });
    setComparison(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Calculator className="h-8 w-8 mr-3 text-purple-400" />
                Scenario Comparison
              </h1>
              <p className="text-gray-300 mt-1">
                Compare different investment strategies to optimize your returns
              </p>
            </div>
          </div>
          
          <Button
            onClick={resetToDefaults}
            variant="outline"
            className="text-gray-300 border-gray-600 hover:border-gray-500"
          >
            Reset to Defaults
          </Button>
        </div>

        {/* Educational Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-300 font-semibold mb-1">How Scenario Comparison Works</h3>
              <p className="text-blue-200 text-sm">
                Adjust the investment rules below to see how different strategies could impact your long-term wealth. 
                The comparison shows projected returns over 5 years based on your current income and expenses.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current Strategy */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-400" />
              Current Strategy
            </h2>
            
            <div className="space-y-4">
              {/* Percentage Rule */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Percentage: {baseRules.percentageRule}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={baseRules.percentageRule}
                  onChange={(e) => setBaseRules(prev => ({
                    ...prev,
                    percentageRule: parseInt(e.target.value)
                  }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Percentage of available cash to invest monthly
                </p>
              </div>

              {/* Round-up Rule */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Round-up Investments
                  </label>
                  <input
                    type="checkbox"
                    checked={baseRules.roundUpEnabled}
                    onChange={(e) => setBaseRules(prev => ({
                      ...prev,
                      roundUpEnabled: e.target.checked
                    }))}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                </div>
                {baseRules.roundUpEnabled && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Multiplier: {baseRules.roundUpMultiplier}x
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={baseRules.roundUpMultiplier}
                      onChange={(e) => setBaseRules(prev => ({
                        ...prev,
                        roundUpMultiplier: parseInt(e.target.value)
                      }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>

              {/* Sweep Rule */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sweep Threshold: ₹{baseRules.sweepThreshold.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="1000"
                  value={baseRules.sweepThreshold}
                  onChange={(e) => setBaseRules(prev => ({
                    ...prev,
                    sweepThreshold: parseInt(e.target.value)
                  }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                {baseRules.sweepThreshold > 0 && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-400 mb-1">
                      Sweep Percentage: {baseRules.sweepPercentage}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={baseRules.sweepPercentage}
                      onChange={(e) => setBaseRules(prev => ({
                        ...prev,
                        sweepPercentage: parseInt(e.target.value)
                      }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alternative Strategy */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
              Alternative Strategy
            </h2>
            
            <div className="space-y-4">
              {/* Percentage Rule */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Percentage: {alternativeRules.percentageRule}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={alternativeRules.percentageRule}
                  onChange={(e) => setAlternativeRules(prev => ({
                    ...prev,
                    percentageRule: parseInt(e.target.value)
                  }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Percentage of available cash to invest monthly
                </p>
              </div>

              {/* Round-up Rule */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Round-up Investments
                  </label>
                  <input
                    type="checkbox"
                    checked={alternativeRules.roundUpEnabled}
                    onChange={(e) => setAlternativeRules(prev => ({
                      ...prev,
                      roundUpEnabled: e.target.checked
                    }))}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                </div>
                {alternativeRules.roundUpEnabled && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Multiplier: {alternativeRules.roundUpMultiplier}x
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={alternativeRules.roundUpMultiplier}
                      onChange={(e) => setAlternativeRules(prev => ({
                        ...prev,
                        roundUpMultiplier: parseInt(e.target.value)
                      }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>

              {/* Sweep Rule */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sweep Threshold: ₹{alternativeRules.sweepThreshold.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="1000"
                  value={alternativeRules.sweepThreshold}
                  onChange={(e) => setAlternativeRules(prev => ({
                    ...prev,
                    sweepThreshold: parseInt(e.target.value)
                  }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                {alternativeRules.sweepThreshold > 0 && (
                  <div className="mt-2">
                    <label className="block text-xs text-gray-400 mb-1">
                      Sweep Percentage: {alternativeRules.sweepPercentage}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={alternativeRules.sweepPercentage}
                      onChange={(e) => setAlternativeRules(prev => ({
                        ...prev,
                        sweepPercentage: parseInt(e.target.value)
                      }))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compare Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleCompareScenarios}
            disabled={isLoading || !user}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3"
          >
            {isLoading ? 'Generating Comparison...' : 'Compare Scenarios'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Comparison Results */}
        {comparison && (
          <div className="space-y-8">
            {/* Chart */}
            <ScenarioComparisonChart
              baseScenario={comparison.baseScenario}
              alternativeScenario={comparison.alternativeScenario}
              differences={comparison.differences}
            />

            {/* Recommendations */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {comparison.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}