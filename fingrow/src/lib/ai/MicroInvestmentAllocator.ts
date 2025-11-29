import { AIRule, Transaction } from '@/types';

export class MicroInvestmentAllocator {
  private rules: AIRule[];
  private transactions: Transaction[];
  private monthlyIncome: number;

  constructor(rules: AIRule[], transactions: Transaction[], monthlyIncome: number) {
    this.rules = rules.filter(r => r.isActive);
    this.transactions = transactions;
    this.monthlyIncome = monthlyIncome;
  }

  calculateInvestmentAmount(): number {
    let totalInvestment = 0;

    this.rules.forEach(rule => {
      switch (rule.ruleType) {
        case 'roundup':
          totalInvestment += this.calculateRoundUp();
          break;
        case 'percentage':
          totalInvestment += this.calculatePercentage(rule.value || 5);
          break;
        case 'sweep':
          totalInvestment += this.calculateSweep();
          break;
      }
    });

    return Math.round(totalInvestment);
  }

  private calculateRoundUp(): number {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    let roundUpTotal = 0;

    expenses.forEach(expense => {
      const rounded = Math.ceil(expense.amount / 10) * 10;
      roundUpTotal += (rounded - expense.amount);
    });

    return roundUpTotal;
  }

  private calculatePercentage(percentage: number): number {
    return (this.monthlyIncome * percentage) / 100;
  }

  private calculateSweep(): number {
    const currentMonthExpenses = this.transactions
      .filter(t => {
        const transDate = new Date(t.date);
        const now = new Date();
        return t.type === 'expense' && 
               transDate.getMonth() === now.getMonth() &&
               transDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const surplus = this.monthlyIncome - currentMonthExpenses;
    // Keep 20% as buffer, invest 80% of surplus
    return Math.max(0, surplus * 0.8);
  }

  getBreakdown() {
    const breakdown: Record<string, number> = {};

    this.rules.forEach(rule => {
      switch (rule.ruleType) {
        case 'roundup':
          breakdown['Round-Up'] = this.calculateRoundUp();
          break;
        case 'percentage':
          breakdown[`${rule.value}% of Income`] = this.calculatePercentage(rule.value || 5);
          break;
        case 'sweep':
          breakdown['End-of-Month Sweep'] = this.calculateSweep();
          break;
      }
    });

    return breakdown;
  }
}
