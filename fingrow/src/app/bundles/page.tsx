'use client';

import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RiskLabel from '@/components/RiskLabel';
import { defaultBundles } from '@/data/bundles';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Shield, TrendingUp, Zap, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

const bundleIcons = {
  safe: Shield,
  balanced: TrendingUp,
  growth: Zap,
};

const bundleRiskProfiles = {
  safe: {
    score: 3,
    label: 'Conservative' as const,
    description: 'Low risk, stable returns',
    recommendedBundle: 'safe' as const
  },
  balanced: {
    score: 7,
    label: 'Moderate' as const,
    description: 'Balanced risk and growth',
    recommendedBundle: 'balanced' as const
  },
  growth: {
    score: 12,
    label: 'Aggressive' as const,
    description: 'High risk, high potential returns',
    recommendedBundle: 'growth' as const
  }
};

export default function BundlesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Investment Bundles</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose a diversified bundle that matches your risk profile and financial goals
            </p>
          </div>

          {/* Disclaimer Card */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Important Disclaimer</h3>
                <p className="text-gray-700 mb-2">
                  <strong>All returns shown (7%, 10%, 14%) are simulated examples and not guaranteed.</strong>
                  {' '}FinGrow is an educational prototype for demonstration purposes only. 
                  Actual investment returns may vary significantly and can result in losses.
                </p>
                <p className="text-sm text-gray-600">
                  This is not financial advice. Please consult with a qualified financial advisor before making investment decisions.
                </p>
              </div>
            </div>
          </Card>

          {/* Comparison Banner */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Smart Diversification</h3>
                <p className="text-gray-600">
                  All bundles are professionally diversified across multiple asset classes to minimize risk 
                  while maximizing returns. Choose based on your risk tolerance and investment horizon.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {defaultBundles.map((bundle, index) => (
              <BundleCard key={bundle.type} bundle={bundle} index={index} />
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <FeatureBox
              icon={<Shield className="w-6 h-6" />}
              title="Educational Purpose"
              description="Prototype for learning investment concepts"
            />
            <FeatureBox
              icon={<TrendingUp className="w-6 h-6" />}
              title="Simulated Returns"
              description="All data is for demonstration only"
            />
            <FeatureBox
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Risk Assessment"
              description="Learn about different risk profiles"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BundleCard({ bundle, index }: any) {
  const chartData = Object.entries(bundle.allocation).map(([name, value]) => ({
    name,
    value
  }));

  const Icon = bundleIcons[bundle.type as keyof typeof bundleIcons];
  const isPopular = bundle.type === 'balanced';
  const riskProfile = bundleRiskProfiles[bundle.type as keyof typeof bundleRiskProfiles];

  const riskColors = {
    safe: 'from-green-500 to-green-600',
    balanced: 'from-blue-500 to-blue-600',
    growth: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="relative">
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      
      <Card className={`p-6 card-hover h-full flex flex-col ${isPopular ? 'border-2 border-blue-300 shadow-2xl' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${riskColors[bundle.type as keyof typeof riskColors]} flex items-center justify-center text-white`}>
            <Icon className="w-6 h-6" />
          </div>
          <RiskLabel riskProfile={riskProfile} size="sm" />
        </div>

        <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{bundle.description}</p>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-2 border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Expected Annual Return</p>
          <p className="text-3xl font-bold text-green-600">{bundle.expectedReturn}%</p>
        </div>

        {/* Disclaimer for returns */}
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-3 w-3 text-yellow-600 mr-1" />
            <span className="text-xs text-yellow-700">Simulated return - not guaranteed</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Asset Allocation</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Button 
          className={`w-full ${isPopular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
        >
          Select {bundle.name} (Demo)
        </Button>
      </Card>
    </div>
  );
}

function FeatureBox({ icon, title, description }: any) {
  return (
    <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
      <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
