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
    bundleType: 'balanced' as 'safe' | 'balanced' | 'growth',
    sendEmail: false
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try API endpoint first (saves to database and can send email)
      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyAmount: parseFloat(formData.monthlyAmount),
          duration: parseInt(formData.duration),
          bundleType: formData.bundleType,
          sendEmail: formData.sendEmail,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data.simulation);
        
        if (formData.sendEmail && data.emailSent) {
          // Show success message for email
          setError(null);
        } else if (formData.sendEmail && !data.emailSent) {
          setError('Simulation completed but email could not be sent. Check your email configuration.');
        }
      } else {
        // Fallback to client-side simulation if API fails
        console.warn('API simulation failed, falling back to client-side');
        const engine = new SimulationEngine(
          parseFloat(formData.monthlyAmount),
          parseInt(formData.duration),
          formData.bundleType
        );
        const simulationResult = engine.simulate();
        setResult(simulationResult);
        
        if (formData.sendEmail) {
          setError('Simulation completed but could not be saved or emailed. Using client-side calculation.');
        }
      }
    } catch (err) {
      console.error('Simulation error:', err);
      
      // Fallback to client-side simulation
      const engine = new SimulationEngine(
        parseFloat(formData.monthlyAmount),
        parseInt(formData.duration),
        formData.bundleType
      );
      const simulationResult = engine.simulate();
      setResult(simulationResult);
      
      if (formData.sendEmail) {
        setError('Simulation completed but could not be saved or emailed. Using client-side calculation.');
      }
    } finally {
      setLoading(false);
    }
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={formData.sendEmail}
                  onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendEmail" className="text-sm font-medium text-gray-700">
                  Email me the simulation results
                </label>
              </div>

              {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">{error}</p>
                </div>
              )}

              <Button 
                onClick={handleSimulate} 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Running Simulation...' : 'Run Simulation'}
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
