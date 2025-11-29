export class RiskProfiler {
  private age: number;
  private monthlyIncome: number;
  private monthlyExpenses: number;
  private investmentHorizon: number; // in years

  constructor(
    age: number,
    monthlyIncome: number,
    monthlyExpenses: number,
    investmentHorizon: number
  ) {
    this.age = age;
    this.monthlyIncome = monthlyIncome;
    this.monthlyExpenses = monthlyExpenses;
    this.investmentHorizon = investmentHorizon;
  }

  calculateRiskProfile(): {
    riskScore: number;
    riskCategory: 'conservative' | 'moderate' | 'aggressive';
    recommendedBundle: 'safe' | 'balanced' | 'growth';
    reasoning: string[];
  } {
    let riskScore = 50; // Start at neutral
    const reasoning: string[] = [];

    // Age factor (younger = higher risk tolerance)
    if (this.age < 30) {
      riskScore += 20;
      reasoning.push('Young age allows for higher risk tolerance');
    } else if (this.age < 45) {
      riskScore += 10;
      reasoning.push('Moderate age with good risk capacity');
    } else {
      riskScore -= 10;
      reasoning.push('Conservative approach recommended for age group');
    }

    // Income to expense ratio
    const savingsRate = (this.monthlyIncome - this.monthlyExpenses) / this.monthlyIncome;
    if (savingsRate > 0.3) {
      riskScore += 15;
      reasoning.push('High savings rate supports aggressive investing');
    } else if (savingsRate > 0.15) {
      riskScore += 5;
      reasoning.push('Moderate savings rate allows balanced approach');
    } else {
      riskScore -= 10;
      reasoning.push('Low savings rate requires conservative strategy');
    }

    // Investment horizon
    if (this.investmentHorizon > 10) {
      riskScore += 15;
      reasoning.push('Long investment horizon enables growth focus');
    } else if (this.investmentHorizon > 5) {
      riskScore += 5;
      reasoning.push('Medium-term horizon suits balanced strategy');
    } else {
      riskScore -= 10;
      reasoning.push('Short-term horizon requires capital preservation');
    }

    // Normalize to 0-100
    riskScore = Math.max(0, Math.min(100, riskScore));

    let riskCategory: 'conservative' | 'moderate' | 'aggressive';
    let recommendedBundle: 'safe' | 'balanced' | 'growth';

    if (riskScore < 40) {
      riskCategory = 'conservative';
      recommendedBundle = 'safe';
    } else if (riskScore < 70) {
      riskCategory = 'moderate';
      recommendedBundle = 'balanced';
    } else {
      riskCategory = 'aggressive';
      recommendedBundle = 'growth';
    }

    return {
      riskScore: Math.round(riskScore),
      riskCategory,
      recommendedBundle,
      reasoning
    };
  }
}
