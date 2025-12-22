import { 
  InvestmentRules, 
  InvestmentScenario, 
  MonthlyProjection 
} from '../types';

export class ScenarioGenerator {
  private readonly DEFAULT_RETURN_RATE = 0.12; // 12% annual return
  private readonly MONTHS_IN_YEAR = 12;

  /**
   * Generates an investment scenario based on user data and rules
   */
  generateScenario(
    scenarioId: string,
    scenarioName: string,
    rules: InvestmentRules,
    userIncome: number,
    userExpenses: number,
    projectionMonths: number = 60 // 5 years default
  ): InvestmentScenario {
    const projections: MonthlyProjection[] = [];
    let cumulativeInvested = 0;
    let projectedValue = 0;

    // Calculate monthly investment based on rules
    const monthlyInvestment = this.calculateMonthlyInvestment(
      rules, 
      userIncome, 
      userExpenses
    );

    for (let month = 1; month <= projectionMonths; month++) {
      // Calculate investment for this month
      const investedThisMonth = monthlyInvestment;
      cumulativeInvested += investedThisMonth;

      // Calculate compound growth
      const monthlyReturnRate = this.DEFAULT_RETURN_RATE / this.MONTHS_IN_YEAR;
      projectedValue = (projectedValue + investedThisMonth) * (1 + monthlyReturnRate);

      projections.push({
        month,
        investedAmount: investedThisMonth,
        cumulativeInvested,
        projectedValue,
        returns: projectedValue - cumulativeInvested
      });
    }

    const totalReturns = projectedValue - cumulativeInvested;
    const returnPercentage = cumulativeInvested > 0 
      ? (totalReturns / cumulativeInvested) * 100 
      : 0;

    return {
      id: scenarioId,
      name: scenarioName,
      rules,
      projections,
      totalInvested: cumulativeInvested,
      finalCorpus: projectedValue,
      totalReturns,
      returnPercentage
    };
  }

  /**
   * Calculates theoretical monthly investment amount based on rules (without caps)
   */
  private calculateTheoreticalMonthlyInvestment(
    rules: InvestmentRules,
    monthlyIncome: number,
    monthlyExpenses: number
  ): number {
    const availableCash = monthlyIncome - monthlyExpenses;
    let totalInvestment = 0;

    // Percentage rule investment
    if (rules.percentageRule > 0) {
      totalInvestment += (availableCash * rules.percentageRule) / 100;
    }

    // Round-up rule (estimated based on transaction frequency)
    if (rules.roundUpEnabled) {
      // Assume average 60 transactions per month with ₹15 average round-up
      const estimatedRoundUps = 60 * 15 * rules.roundUpMultiplier;
      totalInvestment += estimatedRoundUps;
    }

    // Sweep rule (applied to remaining cash after expenses and other investments)
    if (rules.sweepThreshold > 0 && rules.sweepPercentage > 0) {
      const remainingCash = availableCash - totalInvestment;
      if (remainingCash > rules.sweepThreshold) {
        const sweepAmount = (remainingCash - rules.sweepThreshold) * 
          (rules.sweepPercentage / 100);
        totalInvestment += sweepAmount;
      }
    }

    return totalInvestment;
  }

  /**
   * Calculates monthly investment amount based on rules
   */
  private calculateMonthlyInvestment(
    rules: InvestmentRules,
    monthlyIncome: number,
    monthlyExpenses: number
  ): number {
    const availableCash = monthlyIncome - monthlyExpenses;
    let totalInvestment = 0;

    // Percentage rule investment
    if (rules.percentageRule > 0) {
      totalInvestment += (availableCash * rules.percentageRule) / 100;
    }

    // Round-up rule (estimated based on transaction frequency)
    if (rules.roundUpEnabled) {
      // Assume average 60 transactions per month with ₹15 average round-up
      const estimatedRoundUps = 60 * 15 * rules.roundUpMultiplier;
      totalInvestment += estimatedRoundUps;
    }

    // Sweep rule (applied to remaining cash after expenses and other investments)
    if (rules.sweepThreshold > 0 && rules.sweepPercentage > 0) {
      const remainingCash = availableCash - totalInvestment;
      if (remainingCash > rules.sweepThreshold) {
        const sweepAmount = (remainingCash - rules.sweepThreshold) * 
          (rules.sweepPercentage / 100);
        totalInvestment += sweepAmount;
      }
    }

    // Ensure we don't invest more than available cash
    return Math.min(totalInvestment, availableCash * 0.8); // Max 80% of available cash
  }

  /**
   * Creates a modified scenario with rule changes
   */
  createModifiedScenario(
    baseScenario: InvestmentScenario,
    ruleModifications: Partial<InvestmentRules>,
    userIncome: number,
    userExpenses: number,
    newName?: string
  ): InvestmentScenario {
    const modifiedRules: InvestmentRules = {
      ...baseScenario.rules,
      ...ruleModifications
    };

    return this.generateScenario(
      `${baseScenario.id}_modified`,
      newName || `${baseScenario.name} (Modified)`,
      modifiedRules,
      userIncome,
      userExpenses,
      baseScenario.projections.length
    );
  }

  /**
   * Validates investment rules for feasibility
   */
  validateRules(
    rules: InvestmentRules,
    monthlyIncome: number,
    monthlyExpenses: number
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const availableCash = monthlyIncome - monthlyExpenses;

    if (availableCash <= 0) {
      errors.push('No available cash for investment (expenses exceed income)');
    }

    if (rules.percentageRule < 0 || rules.percentageRule > 100) {
      errors.push('Percentage rule must be between 0 and 100');
    }

    if (rules.roundUpMultiplier < 0 || rules.roundUpMultiplier > 10) {
      errors.push('Round-up multiplier must be between 0 and 10');
    }

    if (rules.sweepPercentage < 0 || rules.sweepPercentage > 100) {
      errors.push('Sweep percentage must be between 0 and 100');
    }

    if (rules.sweepThreshold < 0) {
      errors.push('Sweep threshold cannot be negative');
    }

    // Check if total investment would exceed available cash
    const theoreticalMonthlyInvestment = this.calculateTheoreticalMonthlyInvestment(
      rules, 
      monthlyIncome, 
      monthlyExpenses
    );

    if (theoreticalMonthlyInvestment > availableCash * 0.9) {
      errors.push('Investment rules would consume more than 90% of available cash');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}