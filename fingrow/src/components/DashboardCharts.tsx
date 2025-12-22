'use client';

import { Suspense } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Card from '@/components/ui/Card';

const mockGrowthData = [
  { month: 'Jan', value: 0 },
  { month: 'Feb', value: 2500 },
  { month: 'Mar', value: 5200 },
  { month: 'Apr', value: 8100 },
  { month: 'May', value: 11500 },
  { month: 'Jun', value: 15200 },
];

const mockActivityData = [
  { day: 'Mon', amount: 150 },
  { day: 'Tue', amount: 230 },
  { day: 'Wed', amount: 180 },
  { day: 'Thu', amount: 290 },
  { day: 'Fri', amount: 210 },
  { day: 'Sat', amount: 340 },
  { day: 'Sun', amount: 180 },
];

function ChartsContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
          Investment Growth
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockGrowthData}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorGrowth)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
          Weekly Activity
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function ChartsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="h-6 bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
        <div className="h-64 bg-gray-600 rounded animate-pulse"></div>
      </Card>
      
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="h-6 bg-gray-700 rounded w-40 mb-6 animate-pulse"></div>
        <div className="h-64 bg-gray-600 rounded animate-pulse"></div>
      </Card>
    </div>
  );
}

export default function DashboardCharts() {
  return (
    <Suspense fallback={<ChartsLoading />}>
      <ChartsContent />
    </Suspense>
  );
}