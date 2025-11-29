import { Transaction } from '@/types';

export class LiquidityPredictor {
  private monthlyIncome: number;
  private transactions: Transaction[];

  constructor(monthlyIncome: number, transactions: Transaction[]) {
    this.monthlyIncome = monthlyIncome;
    this.transactions = transactions;
  }

  predict(months: number = 3) {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    const avgMonthlyExpenses = expenses.reduce((sum, t) => sum + t.amount, 0) / 
      (expenses.length > 0 ? Math.max(1, this.getMonthsSpan()) : 1);

    const predictions = [];
    const currentDate = new Date();

    for (let i = 1; i <= months; i++) {
      const futureDate = new Date(currentDate);
      futureDate.setMonth(futureDate.getMonth() + i);
      
      // Add some variance to make it realistic
      const variance = (Math.random() - 0.5) * 0.1; // ±5%
      const predictedExpenses = avgMonthlyExpenses * (1 + variance);
      const predictedSurplus = Math.max(0, this.monthlyIncome - predictedExpenses);
      
      // Confidence decreases with time
      const confidence = Math.max(60, 95 - (i * 10));

      predictions.push({
        month: futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        predictedSurplus: Math.round(predictedSurplus),
        predictedExpenses: Math.round(predictedExpenses),
        confidence: Math.round(confidence)
      });
    }

    return predictions;
  }

  private getMonthsSpan(): number {
    if (this.transactions.length === 0) return 1;
    
    const dates = this.transactions.map(t => new Date(t.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    
    return Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24 * 30)));
  }

  getCurrentSurplus(): number {
    const currentMonthExpenses = this.transactions
      .filter(t => {
        const transDate = new Date(t.date);
        const now = new Date();
        return t.type === 'expense' && 
               transDate.getMonth() === now.getMonth() &&
               transDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return Math.max(0, this.monthlyIncome - currentMonthExpenses);
  }
}
