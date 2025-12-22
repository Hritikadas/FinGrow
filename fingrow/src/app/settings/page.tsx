'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useOnboarding } from '@/components/OnboardingTour';
import { 
  RotateCcw, 
  BookOpen, 
  Settings as SettingsIcon,
  Globe,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const [rules, setRules] = useState({
    roundup: true,
    percentage: true,
    percentageValue: 10,
    sweep: false
  });

  const [language, setLanguage] = useState('en');
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();

  const handleResetOnboarding = () => {
    resetOnboarding();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <SettingsIcon className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Onboarding Section */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Getting Started</h2>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <RotateCcw className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-200 mb-1">Reset Onboarding Tour</h3>
                  <p className="text-blue-100 text-sm mb-3">
                    Replay the guided tour to learn about FinGrow's features again. 
                    This will show you the dashboard overview, investment bundles, and simulation features.
                  </p>
                  <Button
                    onClick={handleResetOnboarding}
                    variant="outline"
                    className="text-blue-300 border-blue-500 hover:border-blue-400 hover:bg-blue-500/10"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start Tour Again
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm text-yellow-200">
                  The tour will start immediately when you return to the dashboard
                </span>
              </div>
            </div>
          </Card>

          {/* Auto-Investment Rules */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <SettingsIcon className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Auto-Investment Rules</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">Round-Up Rule</h3>
                  <p className="text-sm text-gray-300">
                    Round up expenses to nearest ₹10 and invest the difference
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.roundup}
                    onChange={(e) => setRules({ ...rules, roundup: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Percentage of Income</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Invest a fixed percentage of your monthly income
                  </p>
                  {rules.percentage && (
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={rules.percentageValue}
                      onChange={(e) => setRules({ ...rules, percentageValue: parseInt(e.target.value) })}
                      className="w-32 bg-white/10 border-white/20 text-white"
                    />
                  )}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.percentage}
                    onChange={(e) => setRules({ ...rules, percentage: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">End-of-Month Sweep</h3>
                  <p className="text-sm text-gray-300">
                    Invest 80% of remaining balance at month end
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rules.sweep}
                    onChange={(e) => setRules({ ...rules, sweep: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            <Button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Save Rules
            </Button>
          </Card>

          {/* Language Preference */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-6 w-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Language Preference</h2>
            </div>
            
            <select
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en" className="bg-slate-800">English</option>
              <option value="hi" className="bg-slate-800">हिंदी (Hindi)</option>
            </select>

            <Button className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              Save Language
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
