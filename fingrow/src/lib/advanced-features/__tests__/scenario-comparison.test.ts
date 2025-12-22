import { ScenarioGenerator } from '../scenario-comparison/ScenarioGenerator';
import { ComparisonCalculator } from '../scenario-comparison/ComparisonCalculator';
import { InvestmentRules } from '../types';

describe('Scenario Comparison Tests', () => {
  let generator: ScenarioGenerator;
  let calculator: ComparisonCalculator;

  beforeEach(() => {
    generator = new ScenarioGenerator();
    calculator = new ComparisonCalculator();
  });

  describe('ScenarioGenerator', () => {
    /**
     * **Feature: advanced-features, Property 1: Scenario Calculation Consistency**
     * For any investment rule modification, the scenario comparison should generate 
     * mathematically consistent projections where the sum of monthly investments 
     * equals the total invested amount
     */
    test('Property 1: Scenario Calculation Consistency', () => {
      // Test with various rule combinations
      const testCases = [
        {
          rules: {
            roundUpEnabled: false,
            roundUpMultiplier: 1,
            percentageRule: 10,
            sweepThreshold: 0,
            sweepPercentage: 0
          },
          income: 75000,
          expenses: 55000
        },
        {
          rules: {
            roundUpEnabled: true,
            roundUpMultiplier: 2,
            percentageRule: 20,
            sweepThreshold: 5000,
            sweepPercentage: 50
          },
          income: 100000,
          expenses: 70000
        },
        {
          rules: {
            roundUpEnabled: true,
            roundUpMultiplier: 3,
            percentageRule: 15,
            sweepThreshold: 10000,
            sweepPercentage: 30
          },
          income: 50000,
          expenses: 35000
        }
      ];

      testCases.forEach((testCase, index) => {
        const scenario = generator.generateScenario(
          `test_${index}`,
          `Test Scenario ${index}`,
          testCase.rules,
          testCase.income,
          testCase.expenses,
          24 // 2 years
        );

        // Property: Sum of monthly investments should equal total invested
        const sumOfMonthlyInvestments = scenario.projections.reduce(
          (sum, projection) => sum + projection.investedAmount,
          0
        );

        expect(Math.abs(sumOfMonthlyInvestments - scenario.totalInvested)).toBeLessThan(0.01);

        // Property: Cumulative invested should be monotonically increasing
        for (let i = 1; i < scenario.projections.length; i++) {
          expect(scenario.projections[i].cumulativeInvested)
            .toBeGreaterThanOrEqual(scenario.projections[i - 1].cumulativeInvested);
        }

        // Property: Final cumulative invested should equal total invested
        const finalCumulative = scenario.projections[scenario.projections.length - 1].cumulativeInvested;
        expect(Math.abs(finalCumulative - scenario.totalInvested)).toBeLessThan(0.01);

        // Property: Returns should be non-negative (assuming positive returns)
        expect(scenario.totalReturns).toBeGreaterThanOrEqual(0);

        // Property: Final corpus should be at least total invested (with positive returns)
        expect(scenario.finalCorpus).toBeGreaterThanOrEqual(scenario.totalInvested);
      });
    });

    test('should validate investment rules correctly', () => {
      const validRules: InvestmentRules = {
        roundUpEnabled: true,
        roundUpMultiplier: 2,
        percentageRule: 15,
        sweepThreshold: 5000,
        sweepPercentage: 30
      };

      const validation = generator.validateRules(validRules, 75000, 55000);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid rules', () => {
      const invalidRules: InvestmentRules = {
        roundUpEnabled: true,
        roundUpMultiplier: -1, // Invalid
        percentageRule: 150, // Invalid
        sweepThreshold: -1000, // Invalid
        sweepPercentage: 30
      };

      const validation = generator.validateRules(invalidRules, 75000, 55000);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should handle edge case: no available cash', () => {
      const rules: InvestmentRules = {
        roundUpEnabled: false,
        roundUpMultiplier: 1,
        percentageRule: 10,
        sweepThreshold: 0,
        sweepPercentage: 0
      };

      const validation = generator.validateRules(rules, 50000, 60000); // Expenses > Income
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('No available cash for investment (expenses exceed income)');
    });

    test('should create modified scenarios correctly', () => {
      const baseRules: InvestmentRules = {
        roundUpEnabled: false,
        roundUpMultiplier: 1,
        percentageRule: 10,
        sweepThreshold: 0,
        sweepPercentage: 0
      };

      const baseScenario = generator.generateScenario(
        'base',
        'Base Scenario',
        baseRules,
        75000,
        55000,
        12
      );

      const modifications = { percentageRule: 20 };
      const modifiedScenario = generator.createModifiedScenario(
        baseScenario,
        modifications,
        75000,
        55000,
        'Modified Scenario'
      );

      expect(modifiedScenario.rules.percentageRule).toBe(20);
      expect(modifiedScenario.rules.roundUpEnabled).toBe(false); // Should preserve other rules
      expect(modifiedScenario.projections.length).toBe(baseScenario.projections.length);
    });
  });

  describe('ComparisonCalculator', () => {
    test('should calculate differences correctly', () => {
      const baseRules: InvestmentRules = {
        roundUpEnabled: false,
        roundUpMultiplier: 1,
        percentageRule: 10,
        sweepThreshold: 0,
        sweepPercentage: 0
      };

      const altRules: InvestmentRules = {
        roundUpEnabled: false,
        roundUpMultiplier: 1,
        percentageRule: 20,
        sweepThreshold: 0,
        sweepPercentage: 0
      };

      const baseScenario = generator.generateScenario('base', 'Base', baseRules, 75000, 55000, 24);
      const altScenario = generator.generateScenario('alt', 'Alternative', altRules, 75000, 55000, 24);

      const differences = calculator.calculateDifferences(baseScenario, altScenario);

      expect(differences.totalInvestedDiff).toBe(altScenario.totalInvested - baseScenario.totalInvested);
      expect(differences.finalCorpusDiff).toBe(altScenario.finalCorpus - baseScenario.finalCorpus);
      expect(differences.returnsDiff).toBe(altScenario.totalReturns - baseScenario.totalReturns);

      // Since alt scenario has higher percentage, it should have higher values
      expect(differences.totalInvestedDiff).toBeGreaterThan(0);
      expect(differences.finalCorpusDiff).toBeGreaterThan(0);
      expect(differences.percentageImprovement).toBeGreaterThan(0);
    });

    test('should generate meaningful recommendations', () => {
      const baseRules: InvestmentRules = {
        roundUpEnabled: false,
        roundUpMultiplier: 1,
        percentageRule: 10,
        sweepThreshold: 0,
        sweepPercentage: 0
      };

      const altRules: InvestmentRules = {
        roundUpEnabled: true,
        roundUpMultiplier: 2,
        percentageRule: 20,
        sweepThreshold: 5000,
        sweepPercentage: 30
      };

      const baseScenario = generator.generateScenario('base', 'Base', baseRules, 75000, 55000, 36);
      const altScenario = generator.generateScenario('alt', 'Alternative', altRules, 75000, 55000, 36);

      const differences = calculator.calculateDifferences(baseScenario, altScenario);
      const recommendations = calculator.generateRecommendations(baseScenario, altScenario, differences);

      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(rec => rec.includes('investment'))).toBe(true);
    });

    test('should create complete comparison object', () => {
      const baseRules: InvestmentRules = {
        roundUpEnabled: false,
        roundUpMultiplier: 1,
        percentageRule: 15,
        sweepThreshold: 0,
        sweepPercentage: 0
      };

      const altRules: InvestmentRules = {
        roundUpEnabled: true,
        roundUpMultiplier: 1,
        percentageRule: 15,
        sweepThreshold: 0,
        sweepPercentage: 0
      };

      const baseScenario = generator.generateScenario('base', 'Base', baseRules, 75000, 55000, 12);
      const altScenario = generator.generateScenario('alt', 'Alternative', altRules, 75000, 55000, 12);

      const comparison = calculator.createComparison('user123', baseScenario, altScenario);

      expect(comparison.userId).toBe('user123');
      expect(comparison.baseScenario).toBe(baseScenario);
      expect(comparison.alternativeScenario).toBe(altScenario);
      expect(comparison.differences).toBeDefined();
      expect(comparison.recommendations).toBeInstanceOf(Array);
    });

    test('should calculate summary statistics for multiple scenarios', () => {
      const scenarios = [
        generator.generateScenario('s1', 'Scenario 1', 
          { roundUpEnabled: false, roundUpMultiplier: 1, percentageRule: 10, sweepThreshold: 0, sweepPercentage: 0 },
          75000, 55000, 12),
        generator.generateScenario('s2', 'Scenario 2',
          { roundUpEnabled: false, roundUpMultiplier: 1, percentageRule: 20, sweepThreshold: 0, sweepPercentage: 0 },
          75000, 55000, 12),
        generator.generateScenario('s3', 'Scenario 3',
          { roundUpEnabled: true, roundUpMultiplier: 2, percentageRule: 15, sweepThreshold: 0, sweepPercentage: 0 },
          75000, 55000, 12)
      ];

      const stats = calculator.calculateSummaryStats(scenarios);

      expect(stats.bestCase).toBeDefined();
      expect(stats.worstCase).toBeDefined();
      expect(stats.averageReturns).toBeGreaterThan(0);
      expect(stats.averageInvestment).toBeGreaterThan(0);
      expect(stats.riskSpread).toBeGreaterThanOrEqual(0);

      // Best case should have highest final corpus
      expect(stats.bestCase.finalCorpus).toBeGreaterThanOrEqual(stats.worstCase.finalCorpus);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle zero income gracefully', () => {
      const rules: InvestmentRules = {
        roundUpEnabled: false,
        roundUpMultiplier: 1,
        percentageRule: 10,
        sweepThreshold: 0,
        sweepPercentage: 0
      };

      const validation = generator.validateRules(rules, 0, 0);
      expect(validation.isValid).toBe(false);
    });

    test('should handle very high investment percentages', () => {
      const rules: InvestmentRules = {
        roundUpEnabled: true,
        roundUpMultiplier: 5, // Max multiplier
        percentageRule: 50, // High percentage
        sweepThreshold: 1000, // Low threshold
        sweepPercentage: 100 // Max sweep
      };

      // This combination should exceed 90% of available cash
      const validation = generator.validateRules(rules, 75000, 55000);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(error => error.includes('90%'))).toBe(true);
    });

    test('should handle empty scenario list in summary stats', () => {
      expect(() => calculator.calculateSummaryStats([])).toThrow();
    });
  });
});