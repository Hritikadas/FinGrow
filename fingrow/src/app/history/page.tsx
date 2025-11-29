'use client';

import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function HistoryPage() {
  const mockHistory = [
    {
      id: '1',
      bundleType: 'Balanced',
      amount: 5000,
      investedAt: new Date('2024-01-15'),
      currentValue: 5250,
      status: 'active'
    },
    {
      id: '2',
      bundleType: 'Growth',
      amount: 3000,
      investedAt: new Date('2024-02-01'),
      currentValue: 3180,
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Investment History</h1>

        <div className="space-y-4">
          {mockHistory.map((investment) => (
            <Card key={investment.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{investment.bundleType} Bundle</h3>
                  <p className="text-sm text-gray-600">
                    Invested on {formatDate(investment.investedAt)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Invested</p>
                  <p className="text-lg font-semibold">{formatCurrency(investment.amount)}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(investment.currentValue)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Returns</p>
                  <p className="text-lg font-semibold text-green-600">
                    +{formatCurrency(investment.currentValue - investment.amount)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
