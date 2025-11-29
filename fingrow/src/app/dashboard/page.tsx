'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import gsap from 'gsap';
import { formatCurrency } from '@/lib/utils';
import { 
  TrendingUp, 
  Wallet, 
  Target, 
  Flame,
  ArrowUpRight,
  Sparkles,
  TrendingDown,
  DollarSign,
  Activity
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

export default function DashboardPage() {
  const [user, setUser] = useState<any>(() => {
    // Initialize user from localStorage immediately (client-side only)
    if (typeof window === 'undefined') return null;

    const userData = localStorage.getItem('user');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  });
  const dashboardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Sync user from localStorage on mount (middleware already protects this route)
    if (typeof window === 'undefined') return;

    const userData = localStorage.getItem('user');
    if (!userData) {
      // No user in localStorage, check if we're authenticated via cookie
      fetch('/api/auth/check', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (!data.authenticated) {
            // Not authenticated, redirect to login
            window.location.href = '/login';
          }
        })
        .catch(() => {
          // Error checking auth, redirect to login
          window.location.href = '/login';
        });
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch {
      // If parsing fails, clear bad data and redirect
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    // Animate dashboard elements once - faster animations
    if (user && !hasAnimated.current && dashboardRef.current) {
      hasAnimated.current = true;
      
      const ctx = gsap.context(() => {
        gsap.from('.welcome-header', {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.out',
        });

        gsap.from('.stat-card', {
          opacity: 0,
          y: 30,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.1,
        });

        gsap.from('.chart-card', {
          opacity: 0,
          scale: 0.98,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.3,
        });

        gsap.from('.insight-item', {
          opacity: 0,
          x: -20,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.5,
        });

        gsap.from('.action-btn', {
          opacity: 0,
          y: 15,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.6,
        });
      }, dashboardRef);

      return () => ctx.revert();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="welcome-header mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            Welcome back, {user.name}! 
            <span className="animate-wave inline-block">👋</span>
          </h1>
          <p className="text-gray-600 text-lg">Here's your investment overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Wallet className="w-6 h-6" />}
            label="Total Invested"
            value={formatCurrency(15200)}
            change="+12.5%"
            trend="up"
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Current Value"
            value={formatCurrency(16840)}
            change="+10.8%"
            trend="up"
            color="green"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Active Goals"
            value="3"
            change="2 on track"
            trend="neutral"
            color="purple"
          />
          <StatCard
            icon={<Flame className="w-6 h-6" />}
            label="Savings Streak"
            value="28 days"
            change="Keep it up!"
            trend="up"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="chart-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Portfolio Growth</h2>
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                <span>+10.8%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockGrowthData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="chart-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Weekly Activity</h2>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Quick Actions & AI Insights */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold">AI Insights</h2>
            </div>
            <div className="space-y-4">
              <div className="insight-item">
                <InsightCard
                  emoji="💡"
                  title="Investment Opportunity"
                  description="You can invest ₹2,500 this month based on your spending pattern"
                  color="blue"
                />
              </div>
              <div className="insight-item">
                <InsightCard
                  emoji="📈"
                  title="Risk Profile"
                  description="Your risk profile suggests a Balanced portfolio for optimal returns"
                  color="purple"
                />
              </div>
              <div className="insight-item">
                <InsightCard
                  emoji="🎯"
                  title="Goal Progress"
                  description="On track to reach your goals with current investments. Keep going!"
                  color="green"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <div className="action-btn">
                <ActionButton href="/bundles" icon={<DollarSign className="w-4 h-4" />}>
                  Explore Bundles
                </ActionButton>
              </div>
              <div className="action-btn">
                <ActionButton href="/simulation" icon={<TrendingUp className="w-4 h-4" />}>
                  Run Simulation
                </ActionButton>
              </div>
              <div className="action-btn">
                <ActionButton href="/settings" icon={<Target className="w-4 h-4" />}>
                  Configure Rules
                </ActionButton>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, trend, color }: any) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const trendColors: Record<string, string> = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className="stat-card p-6 card-hover">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color] || colors.blue} flex items-center justify-center mb-3 text-white`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <div className="flex items-center gap-1">
        {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-600" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
        <span className={`text-sm font-medium ${trendColors[trend] || trendColors.neutral}`}>{change}</span>
      </div>
    </Card>
  );
}

function InsightCard({ emoji, title, description, color }: any) {
  const borderColors: Record<string, string> = {
    blue: 'border-l-blue-500',
    purple: 'border-l-purple-500',
    green: 'border-l-green-500',
  };

  return (
    <div className={`border-l-4 ${borderColors[color] || borderColors.blue} bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-colors`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ href, icon, children }: any) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all group border border-gray-200"
    >
      <div className="text-primary-600 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="font-medium flex-1">{children}</span>
      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
