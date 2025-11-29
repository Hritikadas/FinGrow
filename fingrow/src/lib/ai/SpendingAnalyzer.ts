import { Transaction } from '@/types';

export class SpendingAnalyzer {
  private transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
  }

  analyze() {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    expenses.forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

    // Identify recurring expenses (simplified: categories with multiple transactions)
    const categoryCounts: Record<string, number> = {};
    expenses.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });
    
    const recurringExpenses = Object.entries(categoryCounts)
      .filter(([_, count]) => count >= 2)
      .reduce((sum, [cat]) => sum + categoryBreakdown[cat], 0);

    // Spending trend analysis
    const sortedExpenses = expenses.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const midPoint = Math.floor(sortedExpenses.length / 2);
    const firstHalf = sortedExpenses.slice(0, midPoint).reduce((sum, t) => sum + t.amount, 0);
    const secondHalf = sortedExpenses.slice(midPoint).reduce((sum, t) => sum + t.amount, 0);
    
    let spendingTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (secondHalf > firstHalf * 1.1) spendingTrend = 'increasing';
    else if (secondHalf < firstHalf * 0.9) spendingTrend = 'decreasing';

    return {
      totalExpenses,
      categoryBreakdown,
      recurringExpenses,
      spendingTrend,
      averageDaily: totalExpenses / 30,
      topCategories: Object.entries(categoryBreakdown)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, amount]) => ({ category, amount }))
    };
  }

  getSpendingHeatmap() {
    const heatmap: Record<string, number> = {};
    
    this.transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = new Date(t.date).toISOString().split('T')[0];
        heatmap[date] = (heatmap[date] || 0) + t.amount;
      });

    return Object.entries(heatmap).map(([date, amount]) => ({ date, amount }));
  }
}
