'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { UserPlus, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    investmentHorizon: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const ctx = gsap.context(() => {
      gsap.from('.signup-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.from('.signup-benefits', {
        opacity: 0,
        x: 30,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.2,
      });
    }, pageRef);

    return () => ctx.revert();
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Signup: attempting with', formData.email);
      // Validate inputs
      const age = parseInt(formData.age);
      const income = parseFloat(formData.monthlyIncome);
      const expenses = parseFloat(formData.monthlyExpenses);
      const investmentHorizon = parseInt(formData.investmentHorizon);

      if (isNaN(age) || age < 18 || age > 100) {
        throw new Error('Please enter a valid age (18-100)');
      }

      if (isNaN(income) || income <= 0) {
        throw new Error('Please enter a valid monthly income');
      }

      if (isNaN(expenses) || expenses <= 0) {
        throw new Error('Please enter valid monthly expenses');
      }

      if (expenses >= income) {
        throw new Error('Monthly expenses should be less than monthly income');
      }

      if (isNaN(investmentHorizon) || investmentHorizon < 1 || investmentHorizon > 50) {
        throw new Error('Please enter a valid investment horizon (1-50 years)');
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: age,
          monthlyIncome: income,
          monthlyExpenses: expenses,
          investmentHorizon: investmentHorizon,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Signup failed:', { status: res.status, data });
        throw new Error(data.error || 'Signup failed');
      }

      // Store user data in localStorage (token is in cookie)
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Signup successful, redirecting to dashboard...', { user: data.user });

      // Use hard redirect to avoid any client-side routing issues
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <Card className="signup-card lg:col-span-3 p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-16">
                <Image
                  src="/images/fingrow-logo.svg"
                  alt="FinGrow Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center mb-2 gradient-text">Create Account</h1>
            <p className="text-center text-gray-600 mb-8">Start your investment journey today</p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="font-semibold">Signup Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                {error.includes('database') || error.includes('connect') || error.includes('reach') ? (
                  <div className="mt-3 text-sm bg-white p-3 rounded border border-red-300">
                    <p className="font-semibold mb-1">💡 Database Not Connected</p>
                    <p>Please set up the database first. See <code className="bg-red-100 px-1 rounded">DATABASE_SETUP.md</code> for instructions.</p>
                  </div>
                ) : null}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                
                <Input
                  label="Age"
                  type="number"
                  required
                  placeholder="25"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              
              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Monthly Income (₹)"
                  type="number"
                  required
                  placeholder="50000"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                />
                
                <Input
                  label="Monthly Expenses (₹)"
                  type="number"
                  required
                  placeholder="30000"
                  value={formData.monthlyExpenses}
                  onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                />
              </div>

              <Input
                label="Investment Horizon (Years)"
                type="number"
                required
                placeholder="10"
                min="1"
                max="50"
                value={formData.investmentHorizon}
                onChange={(e) => setFormData({ ...formData, investmentHorizon: e.target.value })}
                helperText="How long do you plan to invest? (1-50 years)"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </Card>

          {/* Benefits Section */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="signup-benefits text-xl font-bold text-gray-800 mb-4">Why FinGrow?</h3>
            <div className="signup-benefits"><BenefitItem text="AI-powered investment recommendations" /></div>
            <div className="signup-benefits"><BenefitItem text="Automated micro-investments" /></div>
            <div className="signup-benefits"><BenefitItem text="7-14% annual returns" /></div>
            <div className="signup-benefits"><BenefitItem text="Start with just ₹1" /></div>
            <div className="signup-benefits"><BenefitItem text="Secure & regulated platform" /></div>
            <div className="signup-benefits"><BenefitItem text="24/7 AI chatbot support" /></div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>🔒 Secure & Encrypted • 🛡️ Your data is safe with us • ⚡ Get started in 2 minutes</p>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
