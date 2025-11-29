export interface User {
  id: string;
  email: string;
  name: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  language: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  type: 'expense' | 'income';
  date: Date;
}

export interface InvestmentHistory {
  id: string;
  userId: string;
  bundleType: 'safe' | 'balanced' | 'growth';
  amount: number;
  expectedReturn: number;
  riskScore: number;
  duration: number;
  status: string;
  investedAt: Date;
  currentValue?: number;
}

export interface Bundle {
  id: string;
  name: string;
  type: 'safe' | 'balanced' | 'growth';
  description: string;
  expectedReturn: number;
  riskScore: number;
  allocation: Record<string, number>;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetYear: number;
  requiredMonthly: number;
  probability: number;
}

export interface AIRule {
  id: string;
  userId: string;
  ruleType: 'roundup' | 'percentage' | 'sweep';
  isActive: boolean;
  value?: number;
}

export interface SpendingAnalysis {
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
  recurringExpenses: number;
  predictedSurplus: number;
  spendingTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface LiquidityPrediction {
  month: string;
  predictedSurplus: number;
  confidence: number;
}

export interface SimulationResult {
  monthlyInvestments: Array<{
    month: number;
    amount: number;
    cumulativeAmount: number;
  }>;
  finalCorpus: number;
  totalInvested: number;
  totalReturns: number;
}

export interface Notification {
  id: string;
  type: 'alert' | 'nudge' | 'achievement';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Streak {
  type: 'savings' | 'investment';
  currentStreak: number;
  longestStreak: number;
}
