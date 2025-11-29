'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SimulationEngine } from '@/lib/ai/SimulationEngine';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SimulationPage() {
  const [formData, setFormData] = useState({
    monthlyAmount: '1000',
    duration: '12',
    bundleType: 'balanced' as 'safe' | 'balanced' | 'growth'
  });
  const [result, setResult] = useState<any>(null);

  const handleSimulate = () => {
    const engine = new SimulationEngine(
      parseFloat(formData.monthlyAmount),
      parseInt(formData.duration),
      formData.bundleType
    );
    const simulationResult = engine.simulate();
    setResult(simulationResult);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Investment Simulator</h1>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Simulation Parameters</h2>
            
            <div className="space-y-4">
              <Input
                label="Monthly Investment Amount (₹)"
                type="number"
                value={formData.monthlyAmount}
                onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (months)
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bundle Type
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.bundleType}
                  onChange={(e) => setFormData({ ...formData, bundleType: e.target.value as any })}
                >
                  <option value="safe">Safe (7% return)</option>
                  <option value="balanced">Balanced (10% return)</option>
                  <option value="growth">Growth (14% return)</option>
                </select>
              </div>

              <Button onClick={handleSimulate} className="w-full">
                Run Simulation
              </Button>
            </div>
          </Card>

          {result && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Invested</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(result.totalInvested)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Final Corpus</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(result.finalCorpus)}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(result.totalReturns)}
                </p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.monthlyInvestments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cumulativeAmount" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
