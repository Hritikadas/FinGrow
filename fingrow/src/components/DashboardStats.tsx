'use client';

import { Suspense } from 'react';
import Card from '@/components/ui/Card';
import RiskLabel from '@/components/RiskLabel';
import { formatCurrency } from '@/lib/utils';
import { 
  TrendingUp, 
  Wallet, 
  Target, 
  Flame,
  ArrowUpRight,
  Sparkles,
  TrendingDown,
  DollarSign,
  Activity,
  Shield,
  Info
} from 'lucide-react';
import { RiskProfile } from '@/components/RiskQuestionnaire';

interface DashboardStatsProps {
  user: any;
  riskProfile?: RiskProfile;
}

function StatsCard({ title, value, change, icon: Icon, trend, disclaimer }: {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: 'up' | 'down';
  disclaimer?: string;
}) {
  return (
    <Card className="group p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <Icon className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        <div className="flex items-center space-x-1">
          {trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 text-green-400" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-400" />
          )}
          <span className={`text-xs ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        </div>
        {disclaimer && (
          <div className="flex items-center mt-2">
            <Info className="h-3 w-3 text-yellow-400 mr-1" />
            <span className="text-xs text-yellow-200">{disclaimer}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function RiskProfileCard({ riskProfile }: { riskProfile?: RiskProfile }) {
  if (!riskProfile) {
    return (
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300">Risk Profile</h3>
          <Shield className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-400">Not Assessed</p>
          <p className="text-xs text-gray-500">Complete risk assessment to get personalized recommendations</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">Your Risk Profile</h3>
        <Shield className="h-5 w-5 text-purple-400" />
      </div>
      <div className="space-y-3">
        <RiskLabel riskProfile={riskProfile} size="lg" />
        <p className="text-xs text-gray-400">{riskProfile.description}</p>
        <div className="text-xs text-purple-300">
          Recommended: <span className="font-medium capitalize">{riskProfile.recommendedBundle}</span> Bundle
        </div>
      </div>
    </Card>
  );
}

function StatsContent({ user, riskProfile }: DashboardStatsProps) {
  const totalInvestments = 15200;
  const monthlyGrowth = 8.5;
  const totalReturns = 2340;
  const activeGoals = 3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatsCard
        title="Total Investments"
        value={formatCurrency(totalInvestments)}
        change="+12.5% this month"
        icon={Wallet}
        trend="up"
        disclaimer="Simulated data"
      />
      
      <StatsCard
        title="Monthly Growth"
        value={`${monthlyGrowth}%`}
        change="+2.1% from last month"
        icon={TrendingUp}
        trend="up"
        disclaimer="Example return"
      />
      
      <StatsCard
        title="Total Returns"
        value={formatCurrency(totalReturns)}
        change="+18.2% this month"
        icon={DollarSign}
        trend="up"
        disclaimer="Not guaranteed"
      />
      
      <StatsCard
        title="Active Goals"
        value={activeGoals.toString()}
        change="2 on track"
        icon={Target}
        trend="up"
      />

      <RiskProfileCard riskProfile={riskProfile} />
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
            <div className="h-5 w-5 bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-700 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-600 rounded w-20 animate-pulse"></div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardStats({ user, riskProfile }: DashboardStatsProps) {
  return (
    <Suspense fallback={<StatsLoading />}>
      <StatsContent user={user} riskProfile={riskProfile} />
    </Suspense>
  );
}