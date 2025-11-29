'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { LogIn, Sparkles, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const ctx = gsap.context(() => {
      gsap.from('.login-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.from('.login-logo', {
        opacity: 0,
        scale: 0.7,
        rotation: -90,
        duration: 0.5,
        ease: 'back.out(1.5)',
        delay: 0.1,
      });

      gsap.from('.login-title', {
        opacity: 0,
        y: 15,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.2,
      });

      gsap.from('.login-form', {
        opacity: 0,
        y: 15,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.3,
      });
    }, pageRef);

    return () => ctx.revert();
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Login: attempting with', formData.email);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: ensure cookies are included
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Login failed:', { status: res.status, data });
        throw new Error(data.error || 'Login failed');
      }

      console.log('Login API success:', { user: data.user, hasToken: !!data.token });

      // Store user data in localStorage (token is in cookie)
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Also store token in localStorage as backup
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      console.log('Login successful, cookies should be set now');
      
      // Use router.push for proper Next.js navigation
      // This ensures middleware runs correctly
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <Card className="login-card p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="login-logo w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="login-title text-4xl font-bold text-center mb-2 gradient-text">Welcome Back</h1>
          <p className="login-title text-center text-gray-600 mb-8">Login to continue your investment journey</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-2 animate-bounce-in">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form space-y-5">
            <Input
              label="Email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            
            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Login
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>🔒 Secure & Encrypted • 🛡️ Your data is safe with us</p>
        </div>
      </div>
    </div>
  );
}
