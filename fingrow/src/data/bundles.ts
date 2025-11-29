export const defaultBundles = [
  {
    name: 'Safe Bundle',
    type: 'safe',
    description: 'Low-risk portfolio focused on capital preservation',
    expectedReturn: 7,
    riskScore: 3,
    allocation: {
      'Recurring Deposit': 40,
      'Liquid Funds': 40,
      'Debt Funds': 20
    }
  },
  {
    name: 'Balanced Bundle',
    type: 'balanced',
    description: 'Moderate risk with balanced growth potential',
    expectedReturn: 10,
    riskScore: 5,
    allocation: {
      'SIP (Index Funds)': 40,
      'Debt Funds': 30,
      'Liquid Funds': 20,
      'Gold ETF': 10
    }
  },
  {
    name: 'Growth Bundle',
    type: 'growth',
    description: 'High-growth portfolio for aggressive investors',
    expectedReturn: 14,
    riskScore: 8,
    allocation: {
      'SIP (Equity Funds)': 60,
      'Mid-Cap Funds': 20,
      'Debt Funds': 15,
      'Gold ETF': 5
    }
  }
];
