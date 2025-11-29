import { SimulationResult } from '@/types';

export class SimulationEngine {
  private monthlyInvestment: number;
  private duration: number; // in months
  private bundleType: 'safe' | 'balanced' | 'growth';
  private expectedReturn: number;

  constructor(
    monthlyInvestment: number,
    duration: number,
    bundleType: 'safe' | 'balanced' | 'growth'
  ) {
    this.monthlyInvestment = monthlyInvestment;
    this.duration = duration;
    this.bundleType = bundleType;
    
    // Set expected annual returns
    const returns = { safe: 7, balanced: 10, growth: 14 };
    this.expectedReturn = returns[bundleType];
  }

  simulate(): SimulationResult {
    const monthlyRate = this.expectedReturn / 12 / 100;
    const monthlyInvestments = [];
    let cumulativeAmount = 0;
    let totalInvested = 0;

    for (let month = 1; month <= this.duration; month++) {
      totalInvested += this.monthlyInvestment;
      
      // Calculate compound interest
      cumulativeAmount = (cumulativeAmount + this.monthlyInvestment) * (1 + monthlyRate);
      
      monthlyInvestments.push({
        month,
        amount: Math.round(this.monthlyInvestment),
        cumulativeAmount: Math.round(cumulativeAmount)
      });
    }

    const finalCorpus = Math.round(cumulativeAmount);
    const totalReturns = finalCorpus - totalInvested;

    return {
      monthlyInvestments,
      finalCorpus,
      totalInvested: Math.round(totalInvested),
      totalReturns: Math.round(totalReturns)
    };
  }
}
