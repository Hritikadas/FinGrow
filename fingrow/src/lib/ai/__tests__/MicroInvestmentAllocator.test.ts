import { MicroInvestmentAllocator } from '../MicroInvestmentAllocator';
import { AIRule, Transaction } from '@/types';

describe('MicroInvestmentAllocator', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      userId: 'user1',
      amount: 23.45,
      category: 'groceries',
      type: 'expense',
      date: new Date(),
    },
    {
      id: '2',
      userId: 'user1',
      amount: 156.78,
      category: 'utilities',
      type: 'expense',
      date: new Date(),
    },
    {
      id: '3',
      userId: 'user1',
      amount: 89.12,
      category: 'dining',
      type: 'expense',
      date: new Date(),
    },
  ];

  const mockRules: AIRule[] = [
    {
      id: '1',
      userId: 'user1',
      ruleType: 'roundup',
      isActive: true,
    },
    {
      id: '2',
      userId: 'user1',
      ruleType: 'percentage',
      isActive: true,
      value: 10,
    },
    {
      id: '3',
      userId: 'user1',
      ruleType: 'sweep',
      isActive: true,
    },
  ];

  describe('Normal scenarios', () => {
    it('should calculate investment amount with all rules active', () => {
      const allocator = new MicroInvestmentAllocator(mockRules, mockTransactions, 5000);
      const investment = allocator.calculateInvestmentAmount();

      expect(investment).toBeGreaterThan(0);
      expect(typeof investment).toBe('number');
    });

    it('should provide breakdown of investment sources', () => {
      const allocator = new MicroInvestmentAllocator(mockRules, mockTransactions, 5000);
      const breakdown = allocator.getBreakdown();

      expect(breakdown).toHaveProperty('Round-Up');
      expect(breakdown).toHaveProperty('10% of Income');
      expect(breakdown).toHaveProperty('End-of-Month Sweep');
      
      Object.values(breakdown).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it('should calculate round-up correctly', () => {
      const roundupRule: AIRule[] = [
        {
          id: '1',
          userId: 'user1',
          ruleType: 'roundup',
          isActive: true,
        },
      ];

      const allocator = new MicroInvestmentAllocator(roundupRule, mockTransactions, 5000);
      const breakdown = allocator.getBreakdown();

      // 23.45 -> 30 (6.55), 156.78 -> 160 (3.22), 89.12 -> 90 (0.88)
      // Total roundup should be approximately 10.65
      expect(breakdown['Round-Up']).toBeCloseTo(10.65, 1);
    });

    it('should calculate percentage correctly', () => {
      const percentageRule: AIRule[] = [
        {
          id: '1',
          userId: 'user1',
          ruleType: 'percentage',
          isActive: true,
          value: 15,
        },
      ];

      const allocator = new MicroInvestmentAllocator(percentageRule, [], 4000);
      const breakdown = allocator.getBreakdown();

      expect(breakdown['15% of Income']).toBe(600); // 15% of 4000
    });
  });

  describe('Edge cases', () => {
    it('should handle negative cashflow scenarios', () => {
      const highExpenseTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 6000,
          category: 'emergency',
          type: 'expense',
          date: new Date(),
        },
      ];

      const allocator = new MicroInvestmentAllocator(mockRules, highExpenseTransactions, 3000);
      const investment = allocator.calculateInvestmentAmount();

      // Should still calculate roundup and percentage, but sweep should be 0
      expect(investment).toBeGreaterThanOrEqual(0);
      
      const breakdown = allocator.getBreakdown();
      expect(breakdown['End-of-Month Sweep']).toBe(0);
    });

    it('should handle irregular income patterns', () => {
      const irregularRules: AIRule[] = [
        {
          id: '1',
          userId: 'user1',
          ruleType: 'percentage',
          isActive: true,
          value: 5,
        },
      ];

      // Very low income
      const lowIncomeAllocator = new MicroInvestmentAllocator(irregularRules, [], 500);
      const lowInvestment = lowIncomeAllocator.calculateInvestmentAmount();
      expect(lowInvestment).toBe(25); // 5% of 500

      // Very high income
      const highIncomeAllocator = new MicroInvestmentAllocator(irregularRules, [], 50000);
      const highInvestment = highIncomeAllocator.calculateInvestmentAmount();
      expect(highInvestment).toBe(2500); // 5% of 50000
    });

    it('should handle big one-time expenses', () => {
      const bigExpenseTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 15000,
          category: 'car',
          type: 'expense',
          date: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          amount: 50.25,
          category: 'groceries',
          type: 'expense',
          date: new Date(),
        },
      ];

      const allocator = new MicroInvestmentAllocator(mockRules, bigExpenseTransactions, 8000);
      const breakdown = allocator.getBreakdown();

      // Round-up should still work
      expect(breakdown['Round-Up']).toBeGreaterThan(0);
      // Percentage should still work
      expect(breakdown['10% of Income']).toBe(800);
      // Sweep should be 0 due to negative cashflow
      expect(breakdown['End-of-Month Sweep']).toBe(0);
    });

    it('should handle zero income', () => {
      const allocator = new MicroInvestmentAllocator(mockRules, mockTransactions, 0);
      const breakdown = allocator.getBreakdown();

      expect(breakdown['10% of Income']).toBe(0);
      expect(breakdown['End-of-Month Sweep']).toBe(0);
      // Only roundup should work
      expect(breakdown['Round-Up']).toBeGreaterThan(0);
    });

    it('should handle empty transactions', () => {
      const allocator = new MicroInvestmentAllocator(mockRules, [], 5000);
      const breakdown = allocator.getBreakdown();

      expect(breakdown['Round-Up']).toBe(0);
      expect(breakdown['10% of Income']).toBe(500);
      expect(breakdown['End-of-Month Sweep']).toBe(4000); // 80% of 5000 (no expenses)
    });

    it('should handle inactive rules', () => {
      const inactiveRules: AIRule[] = [
        {
          id: '1',
          userId: 'user1',
          ruleType: 'roundup',
          isActive: false,
        },
        {
          id: '2',
          userId: 'user1',
          ruleType: 'percentage',
          isActive: true,
          value: 5,
        },
      ];

      const allocator = new MicroInvestmentAllocator(inactiveRules, mockTransactions, 5000);
      const breakdown = allocator.getBreakdown();

      expect(breakdown).not.toHaveProperty('Round-Up');
      expect(breakdown).toHaveProperty('5% of Income');
    });

    it('should handle missing percentage value', () => {
      const ruleWithoutValue: AIRule[] = [
        {
          id: '1',
          userId: 'user1',
          ruleType: 'percentage',
          isActive: true,
          // No value property
        },
      ];

      const allocator = new MicroInvestmentAllocator(ruleWithoutValue, [], 1000);
      const breakdown = allocator.getBreakdown();

      // Should default to 5% when no value is provided, but key will be "undefined% of Income"
      expect(breakdown['undefined% of Income']).toBe(50); // Should default to 5%
    });

    it('should handle very small amounts', () => {
      const smallTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 0.01,
          category: 'test',
          type: 'expense',
          date: new Date(),
        },
      ];

      const allocator = new MicroInvestmentAllocator(mockRules, smallTransactions, 100);
      const investment = allocator.calculateInvestmentAmount();

      expect(investment).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(investment)).toBe(true); // Should be rounded
    });
  });

  describe('Sweep calculation', () => {
    it('should keep 20% buffer in sweep calculation', () => {
      const currentMonthTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 1000,
          category: 'expenses',
          type: 'expense',
          date: new Date(),
        },
      ];

      const sweepRule: AIRule[] = [
        {
          id: '1',
          userId: 'user1',
          ruleType: 'sweep',
          isActive: true,
        },
      ];

      const allocator = new MicroInvestmentAllocator(sweepRule, currentMonthTransactions, 5000);
      const breakdown = allocator.getBreakdown();

      // Surplus = 5000 - 1000 = 4000
      // Sweep = 80% of 4000 = 3200
      expect(breakdown['End-of-Month Sweep']).toBe(3200);
    });

    it('should not invest negative amounts in sweep', () => {
      const highExpenseTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 6000,
          category: 'emergency',
          type: 'expense',
          date: new Date(),
        },
      ];

      const sweepRule: AIRule[] = [
        {
          id: '1',
          userId: 'user1',
          ruleType: 'sweep',
          isActive: true,
        },
      ];

      const allocator = new MicroInvestmentAllocator(sweepRule, highExpenseTransactions, 5000);
      const breakdown = allocator.getBreakdown();

      expect(breakdown['End-of-Month Sweep']).toBe(0);
    });
  });
});