'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SettingsPage() {
  const [rules, setRules] = useState({
    roundup: true,
    percentage: true,
    percentageValue: 10,
    sweep: false
  });

  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Auto-Investment Rules</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Round-Up Rule</h3>
                  <p className="text-sm text-gray-600">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">Percentage of Income</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Invest a fixed percentage of your monthly income
                  </p>
                  {rules.percentage && (
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={rules.percentageValue}
                      onChange={(e) => setRules({ ...rules, percentageValue: parseInt(e.target.value) })}
                      className="w-32"
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">End-of-Month Sweep</h3>
                  <p className="text-sm text-gray-600">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <Button className="mt-4">Save Rules</Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Language Preference</h2>
            
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>

            <Button className="mt-4">Save Language</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
