import { 
  InvestmentScenario, 
  ScenarioDifferences, 
  ScenarioComparison 
} from '../types';

export class ComparisonCalculator {
  /**
   * Calculates differences between two investment scenarios
   */
  calculateDifferences(
    baseScenario: InvestmentScenario,
    alternativeScenario: InvestmentScenario
  ): ScenarioDifferences {
    const totalInvestedDiff = alternativeScenario.totalInvested - baseScenario.totalInvested;
    const finalCorpusDiff = alternativeScenario.finalCorpus - baseScenario.finalCorpus;
    const returnsDiff = alternativeScenario.totalReturns - baseScenario.totalReturns;
    
    const percentageImprovement = baseScenario.finalCorpus > 0 
      ? (finalCorpusDiff / baseScenario.finalCorpus) * 100 
      : 0;

    const breakEvenMonth = this.findBreakEvenPoint(baseScenario, alternativeScenario);

    return {
      totalInvestedDiff,
      finalCorpusDiff,
      returnsDiff,
      percentageImprovement,
      breakEvenMonth
    };
  }

  /**
   * Finds the month where alternative scenario overtakes base scenario
   */
  private findBreakEvenPoint(
    baseScenario: InvestmentScenario,
    alternativeScenario: InvestmentScenario
  ): number | undefined {
    const minLength = Math.min(
      baseScenario.projections.length,
      alternativeScenario.projections.length
    );

    for (let i = 0; i < minLength; i++) {
      const baseValue = baseScenario.projections[i].projectedValue;
      const altValue = alternativeScenario.projections[i].projectedValue;
      
      if (altValue > baseValue) {
        return i + 1; // Return 1-based month number
      }
    }

    return undefined; // No breakeven point found within projection period
  }

  /**
   * Generates recommendations based on scenario comparison
   */
  generateRecommendations(
    baseScenario: InvestmentScenario,
    alternativeScenario: InvestmentScenario,
    differences: ScenarioDifferences
  ): string[] {
    const recommendations: string[] = [];

    // Analyze investment amount differences
    if (differences.totalInvestedDiff > 0) {
      const extraInvestment = Math.abs(differences.totalInvestedDiff);
      recommendations.push(
        `The alternative strategy requires ₹${extraInvestment.toLocaleString()} more investment over the period.`
      );
    } else if (differences.totalInvestedDiff < 0) {
      const lessInvestment = Math.abs(differences.totalInvestedDiff);
      recommendations.push(
        `The alternative strategy requires ₹${lessInvestment.toLocaleString()} less investment while maintaining growth.`
      );
    }

    // Analyze return improvements
    if (differences.percentageImprovement > 10) {
      recommendations.push(
        `Excellent improvement! The alternative strategy could increase your corpus by ${differences.percentageImprovement.toFixed(1)}%.`
      );
    } else if (differences.percentageImprovement > 5) {
      recommendations.push(
        `Good improvement potential of ${differences.percentageImprovement.toFixed(1)}% in final corpus.`
      );
    } else if (differences.percentageImprovement < -5) {
      recommendations.push(
        `The alternative strategy may reduce your corpus by ${Math.abs(differences.percentageImprovement).toFixed(1)}%. Consider sticking with your current approach.`
      );
    }

    // Analyze breakeven point
    if (differences.breakEvenMonth) {
      if (differences.breakEvenMonth <= 12) {
        recommendations.push(
          `The alternative strategy starts outperforming within ${differences.breakEvenMonth} months - quick payoff!`
        );
      } else if (differences.breakEvenMonth <= 24) {
        recommendations.push(
          `The alternative strategy breaks even in ${differences.breakEvenMonth} months - consider your investment timeline.`
        );
      } else {
        recommendations.push(
          `The alternative strategy takes ${differences.breakEvenMonth} months to break even - suitable for long-term investors.`
        );
      }
    } else if (differences.finalCorpusDiff > 0) {
      recommendations.push(
        'The alternative strategy shows consistent outperformance throughout the projection period.'
      );
    }

    // Rule-specific recommendations
    this.addRuleSpecificRecommendations(
      baseScenario,
      alternativeScenario,
      recommendations
    );

    return recommendations;
  }

  /**
   * Adds recommendations based on specific rule changes
   */
  private addRuleSpecificRecommendations(
    baseScenario: InvestmentScenario,
    alternativeScenario: InvestmentScenario,
    recommendations: string[]
  ): void {
    const baseRules = baseScenario.rules;
    const altRules = alternativeScenario.rules;

    // Percentage rule changes
    if (altRules.percentageRule !== baseRules.percentageRule) {
      const diff = altRules.percentageRule - baseRules.percentageRule;
      if (diff > 0) {
        recommendations.push(
          `Increasing your investment percentage by ${diff}% could significantly boost long-term wealth.`
        );
      }
    }

    // Round-up rule changes
    if (altRules.roundUpEnabled !== baseRules.roundUpEnabled) {
      if (altRules.roundUpEnabled) {
        recommendations.push(
          'Enabling round-up investments can help you invest spare change effortlessly.'
        );
      }
    }

    // Sweep rule changes
    if (altRules.sweepPercentage !== baseRules.sweepPercentage) {
      const diff = altRules.sweepPercentage - baseRules.sweepPercentage;
      if (diff > 0) {
        recommendations.push(
          `Increasing sweep percentage helps capture surplus cash for investment automatically.`
        );
      }
    }
  }

  /**
   * Creates a complete scenario comparison object
   */
  createComparison(
    userId: string,
    baseScenario: InvestmentScenario,
    alternativeScenario: InvestmentScenario
  ): Omit<ScenarioComparison, 'id' | 'createdAt' | 'lastModified'> {
    const differences = this.calculateDifferences(baseScenario, alternativeScenario);
    const recommendations = this.generateRecommendations(
      baseScenario,
      alternativeScenario,
      differences
    );

    return {
      userId,
      baseScenario,
      alternativeScenario,
      differences,
      breakEvenPoint: differences.breakEvenMonth,
      recommendations
    };
  }

  /**
   * Calculates summary statistics for multiple scenarios
   */
  calculateSummaryStats(scenarios: InvestmentScenario[]): {
    bestCase: InvestmentScenario;
    worstCase: InvestmentScenario;
    averageReturns: number;
    averageInvestment: number;
    riskSpread: number;
  } {
    if (scenarios.length === 0) {
      throw new Error('Cannot calculate summary stats for empty scenario list');
    }

    const bestCase = scenarios.reduce((best, current) => 
      current.finalCorpus > best.finalCorpus ? current : best
    );

    const worstCase = scenarios.reduce((worst, current) => 
      current.finalCorpus < worst.finalCorpus ? current : worst
    );

    const totalReturns = scenarios.reduce((sum, scenario) => 
      sum + scenario.totalReturns, 0
    );
    const totalInvestment = scenarios.reduce((sum, scenario) => 
      sum + scenario.totalInvested, 0
    );

    const averageReturns = totalReturns / scenarios.length;
    const averageInvestment = totalInvestment / scenarios.length;

    const riskSpread = bestCase.finalCorpus - worstCase.finalCorpus;

    return {
      bestCase,
      worstCase,
      averageReturns,
      averageInvestment,
      riskSpread
    };
  }
}