import { LiquidityPredictor } from '../LiquidityPredictor';
import { Transaction } from '@/types';

describe('LiquidityPredictor', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      userId: 'user1',
      amount: 500,
      category: 'groceries',
      type: 'expense',
      date: new Date('2024-01-15'),
    },
    {
      id: '2',
      userId: 'user1',
      amount: 200,
      category: 'utilities',
      type: 'expense',
      date: new Date('2024-01-20'),
    },
    {
      id: '3',
      userId: 'user1',
      amount: 1000,
      category: 'rent',
      type: 'expense',
      date: new Date('2024-02-01'),
    },
  ];

  describe('Normal scenarios', () => {
    it('should predict liquidity for normal income and expenses', () => {
      const predictor = new LiquidityPredictor(5000, mockTransactions);
      const predictions = predictor.predict(3);

      expect(predictions).toHaveLength(3);
      expect(predictions[0]).toHaveProperty('month');
      expect(predictions[0]).toHaveProperty('predictedSurplus');
      expect(predictions[0]).toHaveProperty('predictedExpenses');
      expect(predictions[0]).toHaveProperty('confidence');
      expect(predictions[0].confidence).toBeGreaterThan(60);
    });

    it('should calculate current surplus correctly', () => {
      const currentDate = new Date();
      const currentMonthTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 300,
          category: 'groceries',
          type: 'expense',
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        },
      ];

      const predictor = new LiquidityPredictor(3000, currentMonthTransactions);
      const surplus = predictor.getCurrentSurplus();

      expect(surplus).toBe(2700); // 3000 - 300
    });
  });

  describe('Edge cases', () => {
    it('should handle negative cashflow (expenses > income)', () => {
      const highExpenseTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 3000,
          category: 'rent',
          type: 'expense',
          date: new Date('2024-01-01'),
        },
        {
          id: '2',
          userId: 'user1',
          amount: 2000,
          category: 'emergency',
          type: 'expense',
          date: new Date('2024-01-15'),
        },
      ];

      const predictor = new LiquidityPredictor(2000, highExpenseTransactions);
      const predictions = predictor.predict(3);

      // Should handle negative cashflow gracefully
      expect(predictions).toHaveLength(3);
      predictions.forEach(prediction => {
        expect(prediction.predictedSurplus).toBeGreaterThanOrEqual(0); // Should not go negative
      });
    });

    it('should handle irregular income patterns', () => {
      const irregularTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 100,
          category: 'groceries',
          type: 'expense',
          date: new Date('2024-01-01'),
        },
        {
          id: '2',
          userId: 'user1',
          amount: 5000,
          category: 'emergency',
          type: 'expense',
          date: new Date('2024-01-02'),
        },
        {
          id: '3',
          userId: 'user1',
          amount: 50,
          category: 'coffee',
          type: 'expense',
          date: new Date('2024-01-03'),
        },
      ];

      const predictor = new LiquidityPredictor(3000, irregularTransactions);
      const predictions = predictor.predict(6);

      expect(predictions).toHaveLength(6);
      // Confidence should decrease over time
      expect(predictions[0].confidence).toBeGreaterThan(predictions[5].confidence);
    });

    it('should handle big one-time expenses', () => {
      const bigExpenseTransactions: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 10000,
          category: 'car',
          type: 'expense',
          date: new Date('2024-01-01'),
        },
        {
          id: '2',
          userId: 'user1',
          amount: 200,
          category: 'groceries',
          type: 'expense',
          date: new Date('2024-01-15'),
        },
      ];

      const predictor = new LiquidityPredictor(4000, bigExpenseTransactions);
      const predictions = predictor.predict(3);

      expect(predictions).toHaveLength(3);
      // Should average out the big expense over time
      predictions.forEach(prediction => {
        expect(prediction.predictedExpenses).toBeGreaterThan(0);
        expect(prediction.predictedSurplus).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle zero income', () => {
      const predictor = new LiquidityPredictor(0, mockTransactions);
      const predictions = predictor.predict(3);

      expect(predictions).toHaveLength(3);
      predictions.forEach(prediction => {
        expect(prediction.predictedSurplus).toBe(0);
      });
    });

    it('should handle empty transactions', () => {
      const predictor = new LiquidityPredictor(5000, []);
      const predictions = predictor.predict(3);

      expect(predictions).toHaveLength(3);
      predictions.forEach(prediction => {
        expect(prediction.predictedSurplus).toBe(5000); // All income becomes surplus
        expect(prediction.predictedExpenses).toBe(0);
      });
    });

    it('should handle very low income', () => {
      const predictor = new LiquidityPredictor(100, mockTransactions);
      const predictions = predictor.predict(3);

      expect(predictions).toHaveLength(3);
      predictions.forEach(prediction => {
        expect(prediction.predictedSurplus).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle single transaction', () => {
      const singleTransaction: Transaction[] = [
        {
          id: '1',
          userId: 'user1',
          amount: 1000,
          category: 'rent',
          type: 'expense',
          date: new Date('2024-01-01'),
        },
      ];

      const predictor = new LiquidityPredictor(2000, singleTransaction);
      const predictions = predictor.predict(3);

      expect(predictions).toHaveLength(3);
      expect(predictions[0].predictedExpenses).toBeGreaterThan(800); // Just check it's reasonable
    });
  });

  describe('Confidence calculation', () => {
    it('should decrease confidence over time', () => {
      const predictor = new LiquidityPredictor(5000, mockTransactions);
      const predictions = predictor.predict(6);

      for (let i = 1; i < predictions.length; i++) {
        expect(predictions[i].confidence).toBeLessThanOrEqual(predictions[i - 1].confidence);
      }
    });

    it('should have minimum confidence of 60%', () => {
      const predictor = new LiquidityPredictor(5000, mockTransactions);
      const predictions = predictor.predict(12);

      predictions.forEach(prediction => {
        expect(prediction.confidence).toBeGreaterThanOrEqual(60);
      });
    });
  });
});