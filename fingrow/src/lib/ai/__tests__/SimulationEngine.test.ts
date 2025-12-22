import { SimulationEngine } from '../SimulationEngine';

describe('SimulationEngine', () => {
  describe('Normal scenarios', () => {
    it('should simulate safe bundle investment correctly', () => {
      const engine = new SimulationEngine(1000, 12, 'safe');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(12);
      expect(result.totalInvested).toBe(12000);
      expect(result.finalCorpus).toBeGreaterThan(result.totalInvested);
      expect(result.totalReturns).toBe(result.finalCorpus - result.totalInvested);
    });

    it('should simulate balanced bundle investment correctly', () => {
      const engine = new SimulationEngine(1000, 12, 'balanced');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(12);
      expect(result.totalInvested).toBe(12000);
      expect(result.finalCorpus).toBeGreaterThan(result.totalInvested);
    });

    it('should simulate growth bundle investment correctly', () => {
      const engine = new SimulationEngine(1000, 12, 'growth');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(12);
      expect(result.totalInvested).toBe(12000);
      expect(result.finalCorpus).toBeGreaterThan(result.totalInvested);
    });

    it('should show compound growth over time', () => {
      const engine = new SimulationEngine(1000, 24, 'balanced');
      const result = engine.simulate();

      // Each month should show cumulative growth
      for (let i = 1; i < result.monthlyInvestments.length; i++) {
        expect(result.monthlyInvestments[i].cumulativeAmount)
          .toBeGreaterThan(result.monthlyInvestments[i - 1].cumulativeAmount);
      }
    });

    it('should have higher returns for growth vs safe bundles', () => {
      const safeEngine = new SimulationEngine(1000, 12, 'safe');
      const growthEngine = new SimulationEngine(1000, 12, 'growth');

      const safeResult = safeEngine.simulate();
      const growthResult = growthEngine.simulate();

      expect(growthResult.finalCorpus).toBeGreaterThan(safeResult.finalCorpus);
      expect(growthResult.totalReturns).toBeGreaterThan(safeResult.totalReturns);
    });
  });

  describe('Edge cases', () => {
    it('should handle very small investment amounts', () => {
      const engine = new SimulationEngine(1, 12, 'safe');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(12);
      expect(result.totalInvested).toBe(12);
      expect(result.finalCorpus).toBeGreaterThan(0);
      expect(result.totalReturns).toBeGreaterThanOrEqual(0);
    });

    it('should handle very large investment amounts', () => {
      const engine = new SimulationEngine(100000, 12, 'growth');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(12);
      expect(result.totalInvested).toBe(1200000);
      expect(result.finalCorpus).toBeGreaterThan(result.totalInvested);
      expect(result.totalReturns).toBeGreaterThan(0);
    });

    it('should handle very short investment duration', () => {
      const engine = new SimulationEngine(1000, 1, 'balanced');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(1);
      expect(result.totalInvested).toBe(1000);
      expect(result.finalCorpus).toBeGreaterThan(1000);
    });

    it('should handle very long investment duration', () => {
      const engine = new SimulationEngine(1000, 360, 'balanced'); // 30 years
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(360);
      expect(result.totalInvested).toBe(360000);
      expect(result.finalCorpus).toBeGreaterThan(result.totalInvested);
      
      // Long-term compound growth should be significant
      expect(result.totalReturns).toBeGreaterThan(result.totalInvested);
    });

    it('should handle zero investment amount', () => {
      const engine = new SimulationEngine(0, 12, 'safe');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(12);
      expect(result.totalInvested).toBe(0);
      expect(result.finalCorpus).toBe(0);
      expect(result.totalReturns).toBe(0);
    });

    it('should handle fractional investment amounts', () => {
      const engine = new SimulationEngine(999.99, 12, 'balanced');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(12);
      result.monthlyInvestments.forEach(investment => {
        expect(investment.amount).toBe(1000); // Should be rounded
        expect(Number.isInteger(investment.cumulativeAmount)).toBe(true);
      });
    });

    it('should handle irregular monthly amounts due to rounding', () => {
      const engine = new SimulationEngine(333.33, 3, 'safe');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(3);
      result.monthlyInvestments.forEach(investment => {
        expect(investment.amount).toBe(333); // Should be rounded down
      });
    });
  });

  describe('Return calculations', () => {
    it('should use correct return rates for each bundle type', () => {
      const amount = 1000;
      const duration = 12;

      const safeEngine = new SimulationEngine(amount, duration, 'safe');
      const balancedEngine = new SimulationEngine(amount, duration, 'balanced');
      const growthEngine = new SimulationEngine(amount, duration, 'growth');

      const safeResult = safeEngine.simulate();
      const balancedResult = balancedEngine.simulate();
      const growthResult = growthEngine.simulate();

      // Growth should have highest returns, safe should have lowest
      expect(growthResult.totalReturns).toBeGreaterThan(balancedResult.totalReturns);
      expect(balancedResult.totalReturns).toBeGreaterThan(safeResult.totalReturns);
    });

    it('should calculate compound interest correctly', () => {
      const engine = new SimulationEngine(1000, 2, 'balanced'); // 10% annual return
      const result = engine.simulate();

      // Manual calculation for verification
      const monthlyRate = 10 / 12 / 100; // 0.833%
      
      // Month 1: 1000 * (1 + 0.00833) = 1008.33
      const expectedMonth1 = Math.round(1000 * (1 + monthlyRate));
      expect(result.monthlyInvestments[0].cumulativeAmount).toBeCloseTo(expectedMonth1, 0);

      // Month 2: (1008.33 + 1000) * (1 + 0.00833) = 2024.99
      const expectedMonth2 = Math.round((expectedMonth1 + 1000) * (1 + monthlyRate));
      expect(result.monthlyInvestments[1].cumulativeAmount).toBeCloseTo(expectedMonth2, 0);
    });

    it('should ensure all amounts are integers', () => {
      const engine = new SimulationEngine(1234.56, 6, 'growth');
      const result = engine.simulate();

      expect(Number.isInteger(result.finalCorpus)).toBe(true);
      expect(Number.isInteger(result.totalInvested)).toBe(true);
      expect(Number.isInteger(result.totalReturns)).toBe(true);

      result.monthlyInvestments.forEach(investment => {
        expect(Number.isInteger(investment.amount)).toBe(true);
        expect(Number.isInteger(investment.cumulativeAmount)).toBe(true);
      });
    });
  });

  describe('Data consistency', () => {
    it('should maintain consistent data relationships', () => {
      const engine = new SimulationEngine(1500, 18, 'balanced');
      const result = engine.simulate();

      // Total invested should equal monthly amount * duration
      expect(result.totalInvested).toBe(1500 * 18);

      // Total returns should equal final corpus - total invested
      expect(result.totalReturns).toBe(result.finalCorpus - result.totalInvested);

      // Final corpus should equal last month's cumulative amount
      const lastMonth = result.monthlyInvestments[result.monthlyInvestments.length - 1];
      expect(result.finalCorpus).toBe(lastMonth.cumulativeAmount);

      // Each month should have correct month number
      result.monthlyInvestments.forEach((investment, index) => {
        expect(investment.month).toBe(index + 1);
      });
    });

    it('should handle edge case of single month investment', () => {
      const engine = new SimulationEngine(5000, 1, 'safe');
      const result = engine.simulate();

      expect(result.monthlyInvestments).toHaveLength(1);
      expect(result.monthlyInvestments[0].month).toBe(1);
      expect(result.monthlyInvestments[0].amount).toBe(5000);
      expect(result.totalInvested).toBe(5000);
      expect(result.finalCorpus).toBeGreaterThan(5000);
    });
  });
});