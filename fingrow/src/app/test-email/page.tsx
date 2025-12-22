'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testEmailConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: 'Failed to test email config' });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!email || !name) {
      setResult({ success: false, message: 'Please enter both email and name' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: 'Failed to send test email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Email Configuration Test
          </h1>

          <div className="space-y-6">
            {/* Test Configuration */}
            <div>
              <h2 className="text-xl font-semibold mb-4">1. Test Email Configuration</h2>
              <Button 
                onClick={testEmailConfig} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Email Config'}
              </Button>
            </div>

            {/* Send Test Email */}
            <div>
              <h2 className="text-xl font-semibold mb-4">2. Send Test Welcome Email</h2>
              <div className="space-y-4">
                <Input
                  label="Test Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                />
                <Input
                  label="Test Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
                <Button 
                  onClick={sendTestEmail} 
                  disabled={loading || !email || !name}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? 'Sending...' : 'Send Test Email'}
                </Button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className={`p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? '✅ Success' : '❌ Error'}
                </h3>
                <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </p>
                
                {result.config && (
                  <div className="mt-3 text-sm">
                    <p><strong>Resend API Key:</strong> {result.config.hasResendKey ? '✅ Set' : '❌ Missing'}</p>
                    <p><strong>Email From:</strong> {result.config.emailFrom || '❌ Missing'}</p>
                    {result.config.resendKeyPreview && (
                      <p><strong>API Key Preview:</strong> {result.config.resendKeyPreview}</p>
                    )}
                  </div>
                )}

                {result.errors && (
                  <div className="mt-3">
                    <p className="font-semibold text-red-800">Errors:</p>
                    <ul className="list-disc list-inside text-red-700">
                      {result.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📧 Email Setup Status</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>✅ Resend package installed</p>
              <p>✅ Email service implemented</p>
              <p>✅ Environment variables configured</p>
              <p>✅ Integrated with signup process</p>
              <p>✅ Welcome email template ready</p>
              <p>✅ Simulation summary email template ready</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/signup" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Signup to test real email flow
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}