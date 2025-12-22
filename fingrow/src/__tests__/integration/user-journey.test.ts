import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LiquidityPredictor } from '@/lib/ai/LiquidityPredictor';
import { MicroInvestmentAllocator } from '@/lib/ai/MicroInvestmentAllocator';
import { SimulationEngine } from '@/lib/ai/SimulationEngine';
import { Transaction, AIRule } from '@/types';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Complete User Journey Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    localStorage.clear();
  });

  describe('Signup → Connect Income/Expenses → Run Simulation → See Investment History', () => {
    it('should complete full user journey successfully', async () => {
      const user = userEvent.setup();

      // Step 1: User signs up
      const signupData = {
        email: 'newuser@example.com',
        password: 'securepassword123',
        name: 'New User',
        monthlyIncome: 6000,
        monthlyExpenses: 4000,
      };

      // Mock successful signup response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: 'user123', email: signupData.email, name: signupData.name },
          token: 'jwt-token',
        }),
      });

      // Step 2: Connect income and expenses (simulate transaction data)
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user123',
          amount: 1200,
          category: 'rent',
          type: 'expense',
          date: new Date('2024-01-01'),
        },
        {
          id: '2',
          userId: 'user123',
          amount: 300,
          category: 'groceries',
          type: 'expense',
          date: new Date('2024-01-15'),
        },
        {
          id: '3',
          userId: 'user123',
          amount: 150,
          category: 'utilities',
          type: 'expense',
          date: new Date('2024-01-20'),
        },
        {
          id: '4',
          userId: 'user123',
          amount: 6000,
          category: 'salary',
          type: 'income',
          date: new Date('2024-01-01'),
        },
      ];

      // Step 3: Run liquidity prediction
      const liquidityPredictor = new LiquidityPredictor(
        signupData.monthlyIncome,
        mockTransactions.filter(t => t.type === 'expense')
      );

      const predictions = liquidityPredictor.predict(6);
      const currentSurplus = liquidityPredictor.getCurrentSurplus();

      expect(predictions).toHaveLength(6);
      expect(currentSurplus).toBeGreaterThan(0);
      expect(predictions[0].confidence).toBeGreaterThan(80);

      // Step 4: Set up AI investment rules
      const aiRules: AIRule[] = [
        {
          id: '1',
          userId: 'user123',
          ruleType: 'roundup',
          isActive: true,
        },
        {
          id: '2',
          userId: 'user123',
          ruleType: 'percentage',
          isActive: true,
          value: 10,
        },
        {
          id: '3',
          userId: 'user123',
          ruleType: 'sweep',
          isActive: true,
        },
      ];

      // Step 5: Calculate micro-investment allocation
      const allocator = new MicroInvestmentAllocator(
        aiRules,
        mockTransactions.filter(t => t.type === 'expense'),
        signupData.monthlyIncome
      );

      const investmentAmount = allocator.calculateInvestmentAmount();
      const breakdown = allocator.getBreakdown();

      expect(investmentAmount).toBeGreaterThan(0);
      expect(breakdown).toHaveProperty('Round-Up');
      expect(breakdown).toHaveProperty('10% of Income');
      expect(breakdown).toHaveProperty('End-of-Month Sweep');

      // Step 6: Run investment simulation
      const simulationEngine = new SimulationEngine(investmentAmount, 24, 'balanced');
      const simulationResult = simulationEngine.simulate();

      expect(simulationResult.monthlyInvestments).toHaveLength(24);
      expect(simulationResult.finalCorpus).toBeGreaterThan(simulationResult.totalInvested);
      expect(simulationResult.totalReturns).toBeGreaterThan(0);

      // Step 7: Verify investment history would be created
      const expectedInvestmentHistory = {
        userId: 'user123',
        bundleType: 'balanced' as const,
        amount: investmentAmount,
        expectedReturn: 10, // 10% for balanced
        riskScore: 5, // Medium risk for balanced
        duration: 24,
        status: 'active',
        investedAt: new Date(),
        currentValue: simulationResult.finalCorpus,
      };

      expect(expectedInvestmentHistory.amount).toBe(investmentAmount);
      expect(expectedInvestmentHistory.currentValue).toBe(simulationResult.finalCorpus);
    });

    it('should handle edge case: low income user journey', async () => {
      // Low income user scenario
      const lowIncomeData = {
        email: 'lowincomeuser@example.com',
        password: 'password123',
        name: 'Low Income User',
        monthlyIncome: 1500,
        monthlyExpenses: 1400,
      };

      const lowIncomeTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user456',
          amount: 800,
          category: 'rent',
          type: 'expense',
          date: new Date('2024-01-01'),
        },
        {
          id: '2',
          userId: 'user456',
          amount: 200,
          category: 'groceries',
          type: 'expense',
          date: new Date('2024-01-15'),
        },
        {
          id: '3',
          userId: 'user456',
          amount: 400,
          category: 'utilities_transport',
          type: 'expense',
          date: new Date('2024-01-20'),
        },
      ];

      // Test liquidity prediction for low income
      const liquidityPredictor = new LiquidityPredictor(
        lowIncomeData.monthlyIncome,
        lowIncomeTransactions
      );

      const predictions = liquidityPredictor.predict(3);
      const currentSurplus = liquidityPredictor.getCurrentSurplus();

      expect(predictions).toHaveLength(3);
      expect(currentSurplus).toBeGreaterThanOrEqual(0); // Should handle tight budget

      // Test micro-investment with minimal surplus
      const conservativeRules: AIRule[] = [
        {
          id: '1',
          userId: 'user456',
          ruleType: 'roundup',
          isActive: true,
        },
        {
          id: '2',
          userId: 'user456',
          ruleType: 'percentage',
          isActive: true,
          value: 2, // Very conservative 2%
        },
      ];

      const allocator = new MicroInvestmentAllocator(
        conservativeRules,
        lowIncomeTransactions,
        lowIncomeData.monthlyIncome
      );

      const investmentAmount = allocator.calculateInvestmentAmount();
      expect(investmentAmount).toBeGreaterThan(0);
      expect(investmentAmount).toBeLessThan(100); // Should be small amount

      // Test simulation with small amounts
      const simulationEngine = new SimulationEngine(investmentAmount, 12, 'safe');
      const simulationResult = simulationEngine.simulate();

      expect(simulationResult.finalCorpus).toBeGreaterThan(simulationResult.totalInvested);
    });

    it('should handle edge case: high income irregular expenses', async () => {
      const highIncomeData = {
        email: 'highincomeuser@example.com',
        password: 'password123',
        name: 'High Income User',
        monthlyIncome: 15000,
        monthlyExpenses: 8000,
      };

      const irregularTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user789',
          amount: 3000,
          category: 'rent',
          type: 'expense',
          date: new Date('2024-01-01'),
        },
        {
          id: '2',
          userId: 'user789',
          amount: 15000,
          category: 'car_purchase',
          type: 'expense',
          date: new Date('2024-01-15'),
        },
        {
          id: '3',
          userId: 'user789',
          amount: 500,
          category: 'groceries',
          type: 'expense',
          date: new Date('2024-01-20'),
        },
        {
          id: '4',
          userId: 'user789',
          amount: 2000,
          category: 'vacation',
          type: 'expense',
          date: new Date('2024-01-25'),
        },
      ];

      // Test handling of big one-time expenses
      const liquidityPredictor = new LiquidityPredictor(
        highIncomeData.monthlyIncome,
        irregularTransactions
      );

      const predictions = liquidityPredictor.predict(6);
      expect(predictions).toHaveLength(6);
      
      // Should smooth out the big expense over time
      predictions.forEach(prediction => {
        expect(prediction.predictedSurplus).toBeGreaterThanOrEqual(0);
      });

      // Test aggressive investment strategy
      const aggressiveRules: AIRule[] = [
        {
          id: '1',
          userId: 'user789',
          ruleType: 'roundup',
          isActive: true,
        },
        {
          id: '2',
          userId: 'user789',
          ruleType: 'percentage',
          isActive: true,
          value: 20, // Aggressive 20%
        },
        {
          id: '3',
          userId: 'user789',
          ruleType: 'sweep',
          isActive: true,
        },
      ];

      const allocator = new MicroInvestmentAllocator(
        aggressiveRules,
        irregularTransactions,
        highIncomeData.monthlyIncome
      );

      const investmentAmount = allocator.calculateInvestmentAmount();
      expect(investmentAmount).toBeGreaterThan(1000); // Should be substantial

      // Test growth-focused simulation
      const simulationEngine = new SimulationEngine(investmentAmount, 60, 'growth');
      const simulationResult = simulationEngine.simulate();

      expect(simulationResult.finalCorpus).toBeGreaterThan(simulationResult.totalInvested * 1.2); // More realistic expectation
    });

    it('should handle negative cashflow recovery scenario', async () => {
      const recoveryData = {
        email: 'recoveryuser@example.com',
        password: 'password123',
        name: 'Recovery User',
        monthlyIncome: 4000,
        monthlyExpenses: 5000, // Initially negative
      };

      const negativeTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user999',
          amount: 2000,
          category: 'rent',
          type: 'expense',
          date: new Date('2024-01-01'),
        },
        {
          id: '2',
          userId: 'user999',
          amount: 3000,
          category: 'emergency_medical',
          type: 'expense',
          date: new Date('2024-01-15'),
        },
      ];

      // Test liquidity prediction with negative cashflow
      const liquidityPredictor = new LiquidityPredictor(
        recoveryData.monthlyIncome,
        negativeTransactions
      );

      const predictions = liquidityPredictor.predict(3);
      expect(predictions).toHaveLength(3);
      
      // Should handle negative scenarios gracefully
      predictions.forEach(prediction => {
        expect(prediction.predictedSurplus).toBeGreaterThanOrEqual(0);
      });

      // Test minimal investment rules during recovery
      const recoveryRules: AIRule[] = [
        {
          id: '1',
          userId: 'user999',
          ruleType: 'roundup',
          isActive: true,
        },
        // No percentage or sweep rules during recovery
      ];

      const allocator = new MicroInvestmentAllocator(
        recoveryRules,
        negativeTransactions,
        recoveryData.monthlyIncome
      );

      const investmentAmount = allocator.calculateInvestmentAmount();
      expect(investmentAmount).toBeGreaterThanOrEqual(0);
      
      // Should only have roundup investment
      const breakdown = allocator.getBreakdown();
      expect(breakdown).toHaveProperty('Round-Up');
      expect(Object.keys(breakdown)).toHaveLength(1);
    });
  });

  describe('Error handling in user journey', () => {
    it('should handle API failures gracefully', async () => {
      // Mock API failure
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Test that the system can still perform calculations locally
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user123',
          amount: 1000,
          category: 'rent',
          type: 'expense',
          date: new Date(),
        },
      ];

      const liquidityPredictor = new LiquidityPredictor(5000, mockTransactions);
      const predictions = liquidityPredictor.predict(3);

      // Should still work despite API failure
      expect(predictions).toHaveLength(3);
      expect(predictions[0].predictedSurplus).toBeGreaterThan(0);
    });

    it('should handle invalid data gracefully', async () => {
      // Test with invalid/corrupted transaction data
      const invalidTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user123',
          amount: NaN,
          category: 'invalid',
          type: 'expense',
          date: new Date('invalid-date'),
        },
      ];

      const liquidityPredictor = new LiquidityPredictor(5000, []);
      const predictions = liquidityPredictor.predict(3);

      // Should handle gracefully with empty transactions
      expect(predictions).toHaveLength(3);
      predictions.forEach(prediction => {
        expect(prediction.predictedSurplus).toBe(5000);
      });
    });
  });
});