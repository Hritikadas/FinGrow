import { Bundle } from '@/types';

export class BundleOptimizer {
  private bundles: Bundle[];
  private investmentAmount: number;
  private riskTolerance: number; // 0-100

  constructor(bundles: Bundle[], investmentAmount: number, riskTolerance: number) {
    this.bundles = bundles;
    this.investmentAmount = investmentAmount;
    this.riskTolerance = riskTolerance;
  }

  optimizeAllocation() {
    // Select bundle based on risk tolerance
    let selectedBundle: Bundle;

    if (this.riskTolerance < 40) {
      selectedBundle = this.bundles.find(b => b.type === 'safe')!;
    } else if (this.riskTolerance < 70) {
      selectedBundle = this.bundles.find(b => b.type === 'balanced')!;
    } else {
      selectedBundle = this.bundles.find(b => b.type === 'growth')!;
    }

    // Calculate allocation amounts
    const allocation: Record<string, number> = {};
    Object.entries(selectedBundle.allocation).forEach(([asset, percentage]) => {
      allocation[asset] = Math.round((this.investmentAmount * (percentage as number)) / 100);
    });

    return {
      bundle: selectedBundle,
      allocation,
      totalAmount: this.investmentAmount,
      expectedAnnualReturn: selectedBundle.expectedReturn,
      riskScore: selectedBundle.riskScore
    };
  }

  compareAllBundles() {
    return this.bundles.map(bundle => {
      const projectedValue = this.investmentAmount * (1 + bundle.expectedReturn / 100);
      const allocation: Record<string, number> = {};
      
      Object.entries(bundle.allocation).forEach(([asset, percentage]) => {
        allocation[asset] = Math.round((this.investmentAmount * (percentage as number)) / 100);
      });

      return {
        ...bundle,
        allocation,
        projectedValue: Math.round(projectedValue),
        suitability: this.calculateSuitability(bundle)
      };
    });
  }

  private calculateSuitability(bundle: Bundle): number {
    // Calculate how well this bundle matches the user's risk tolerance
    const riskDifference = Math.abs(bundle.riskScore * 10 - this.riskTolerance);
    return Math.max(0, 100 - riskDifference);
  }
}
