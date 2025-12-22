'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function EmailConfigPage() {
  const [config, setConfig] = useState({
    emailFrom: process.env.EMAIL_FROM || 'FinGrow <onboarding@resend.dev>',
    resendKey: ''
  });
  const [result, setResult] = useState<any>(null);

  const currentConfig = {
    emailFrom: 'FinGrow <onboarding@resend.dev>',
    hasResendKey: true,
    keyPreview: 're_LgAwizYF_73PBurLYRkuXzKRUjUdD5X75'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            📧 Email Configuration
          </h1>

          {/* Current Configuration */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <p><strong>From Address:</strong> <code>{currentConfig.emailFrom}</code></p>
                <p><strong>Resend API Key:</strong> {currentConfig.hasResendKey ? '✅ Configured' : '❌ Missing'}</p>
                <p><strong>Key Preview:</strong> <code>{currentConfig.keyPreview}...</code></p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">✅ Working</span></p>
              </div>
            </div>
          </div>

          {/* Email Template Preview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">📧 Welcome Email Preview</h2>
            <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
              <div className="text-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-6 rounded-t-lg">
                  <div className="bg-white text-blue-600 inline-block px-4 py-2 rounded-full mb-4">
                    <strong>FinGrow</strong>
                  </div>
                  <h1 className="text-2xl font-bold">Welcome to FinGrow! 🚀</h1>
                  <p className="opacity-90">Your AI-Powered Investment Journey Starts Here</p>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <h3 className="text-lg font-semibold">Hi [User Name]! 👋</h3>
                <p>Thank you for joining <strong>FinGrow</strong>, your AI-powered micro-investment simulator!</p>
                
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-semibold text-gray-800">🎯 What You Can Do:</h4>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>📊 Explore Investment Bundles (Safe, Balanced, Growth)</li>
                    <li>🤖 Run AI-Powered Simulations</li>
                    <li>📈 Track Portfolio Growth</li>
                    <li>🎓 Learn Investment Strategies</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                  <p className="text-xs"><strong>📚 Educational Notice:</strong> All returns are simulated for learning purposes only.</p>
                </div>
                
                <div className="text-center">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg text-sm">
                    🚀 Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Setup Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">🌐 Domain Setup Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Option 1: Keep Current */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-green-600 mb-2">✅ Current Setup</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Using Resend's testing domain. Works great for development!
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  onboarding@resend.dev
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Pros:</strong> Ready to use<br>
                  <strong>Cons:</strong> May go to spam in production
                </p>
              </div>

              {/* Option 2: Your Domain */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-blue-600 mb-2">🏆 Your Domain</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Use your own domain for professional emails.
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  hello@yourdomain.com
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Pros:</strong> Professional, better delivery<br>
                  <strong>Cons:</strong> Requires DNS setup
                </p>
              </div>

              {/* Option 3: Resend Subdomain */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-purple-600 mb-2">⚡ Resend Subdomain</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Quick setup with Resend's subdomain.
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  hello@yourname.resend.dev
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Pros:</strong> Quick setup, good delivery<br>
                  <strong>Cons:</strong> Not your domain
                </p>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">🔧 Setup Instructions</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">To change your email domain:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to <a href="https://resend.com" target="_blank" className="text-blue-600 underline">resend.com</a> and login</li>
                <li>Click "Domains" → "Add Domain"</li>
                <li>Enter your domain or choose a Resend subdomain</li>
                <li>Follow DNS verification steps (if using your domain)</li>
                <li>Update your <code>.env</code> file:</li>
              </ol>
              
              <div className="mt-4 bg-gray-800 text-green-400 p-4 rounded font-mono text-sm">
                <div># In fingrow/.env</div>
                <div>EMAIL_FROM="FinGrow &lt;hello@yourdomain.com&gt;"</div>
              </div>
              
              <p className="text-sm text-gray-600 mt-3">
                <strong>Note:</strong> Restart your development server after changing the .env file.
              </p>
            </div>
          </div>

          {/* Test Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">🧪 Test Your Email Setup</h2>
            <div className="flex gap-4">
              <a 
                href="/test-email" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Email Configuration
              </a>
              <a 
                href="/signup" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Signup Flow
              </a>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3">💡 Quick Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Start with the current setup for development</li>
              <li>• Use your own domain for production</li>
              <li>• Test emails thoroughly before going live</li>
              <li>• Monitor delivery rates in Resend dashboard</li>
              <li>• Keep email templates simple for better compatibility</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="text-gray-600 hover:text-gray-800 underline"
            >
              ← Back to Homepage
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}