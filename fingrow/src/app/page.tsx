'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { TrendingUp, Shield, Zap, Target, Sparkles, BarChart3, Brain, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Hero animations - faster and smoother
    const ctx = gsap.context(() => {
      // Animate hero elements
      gsap.from('.hero-badge', {
        opacity: 0,
        y: -15,
        duration: 0.4,
        ease: 'back.out(1.5)',
      });

      gsap.from('.hero-title', {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        delay: 0.1,
        ease: 'power2.out',
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out',
      });

      gsap.from('.hero-description', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.3,
        ease: 'power2.out',
      });

      gsap.from('.hero-buttons', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.4,
        ease: 'power2.out',
      });

      gsap.from('.hero-stats', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        delay: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      });

      // Animate background blobs
      gsap.to('.blob-1', {
        x: 50,
        y: 30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.blob-2', {
        x: -30,
        y: -50,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.blob-3', {
        x: 40,
        y: -40,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Feature cards scroll animation - temporarily disabled for debugging
      // gsap.from('.feature-card', {
      //   scrollTrigger: {
      //     trigger: '.features-section',
      //     start: 'top 85%',
      //   },
      //   opacity: 0,
      //   y: 30,
      //   duration: 0.5,
      //   stagger: 0.08,
      //   ease: 'power2.out',
      // });

      // Step cards scroll animation - faster
      gsap.from('.step-card', {
        scrollTrigger: {
          trigger: '.steps-section',
          start: 'top 85%',
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)',
      });

      // CTA section animation - faster
      gsap.from('.cta-section', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [mounted]);
  return (
    <div ref={heroRef} className="min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob-1 absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/20 rounded-full blur-3xl float-animation"></div>
        <div className="blob-2 absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/20 rounded-full blur-3xl float-animation"></div>
        <div className="blob-3 absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-400/20 rounded-full blur-3xl float-animation"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-sparkle"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-sparkle animate-delay-500"></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-pink-400 rounded-full animate-sparkle animate-delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-sparkle animate-delay-1500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Enhanced Badge with better styling */}
          <div className="hero-badge inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full mb-8 border border-white/50 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
              <div className="absolute inset-0 w-5 h-5 bg-purple-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <span className="text-sm font-semibold text-gray-700 relative z-10 tracking-wide">AI-Powered Investment Platform</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Enhanced Logo Section */}
          <div className="hero-title flex flex-col items-center mb-8">
            <div className="relative w-96 h-40 mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Image
                src="/images/fingrow-logo-with-text-colorful.svg"
                alt="FinGrow Logo"
                fill
                className="object-contain drop-shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
          
          {/* Enhanced Main Headline */}
          <div className="hero-subtitle mb-8">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 leading-tight">
              Automate. Invest.
            </h1>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-800 via-pink-600 to-orange-500 bg-clip-text text-transparent leading-tight">
              Grow. Repeat.
            </h1>
          </div>
          
          {/* Enhanced Description */}
          <p className="hero-description text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Transform your <span className="text-blue-600 font-semibold">spare change</span> into wealth with 
            <span className="text-purple-600 font-semibold"> AI-powered</span> micro-investments. 
            <br className="hidden md:block" />
            Start building your financial future today, <span className="text-pink-600 font-semibold">one rupee at a time.</span>
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/signup">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-500/30 transform hover:scale-110 transition-all duration-300 px-10 py-4 text-lg font-semibold">
                <span className="relative z-10 flex items-center gap-3">
                  Get Started Free
                  <div className="relative">
                    <Rocket className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300" />
                    <div className="absolute inset-0 w-6 h-6 bg-white/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                  </div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="group border-2 border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 hover:text-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-10 py-4 text-lg font-semibold backdrop-blur-sm">
                <span className="flex items-center gap-3">
                  Login
                  <TrendingUp className="w-6 h-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="hero-stats group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-blue-600 mb-3 group-hover:scale-105 transition-transform duration-300">7-14%</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Simulated Returns</p>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full group-hover:w-20 transition-all duration-300"></div>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </div>
            
            <div className="hero-stats group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-purple-600 mb-3 group-hover:scale-105 transition-transform duration-300">AI-Driven</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Smart Engine</p>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full group-hover:w-20 transition-all duration-300"></div>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </div>
            
            <div className="hero-stats group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-pink-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-pink-600 mb-3 group-hover:scale-105 transition-transform duration-300">₹1+</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Minimum Ticket</p>
                <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full group-hover:w-20 transition-all duration-300"></div>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-lg border border-white/50">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Powerful Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Everything you need to
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                grow your wealth
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge technology with proven investment strategies 
              to help you build wealth automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Enhanced Feature Cards */}
            <div className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-900 transition-colors">Smart Automation</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  Round-up rules, percentage investing, and end-of-month sweeps that work while you sleep.
                </p>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </div>

            <div className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-purple-900 transition-colors">AI Predictions</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  Predict liquidity and optimize investment timing with advanced machine learning algorithms.
                </p>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </div>

            <div className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-green-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-green-900 transition-colors">Risk Management</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  Diversified bundles tailored to your unique risk profile and investment goals.
                </p>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </div>

            <div className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-pink-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-pink-900 transition-colors">Goal Planning</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  Set financial goals and track progress with personalized AI insights and recommendations.
                </p>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section ref={stepsRef} className="steps-section relative py-24 bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6 shadow-lg border border-white/50">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Simple Process</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              How It
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start investing in just 3 simple steps. Our AI handles the complexity while you focus on your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <StepCard
              number="1"
              title="Sign Up & Connect"
              description="Create your account and connect your financial goals in under 2 minutes. Our secure platform protects your data."
              icon={<Sparkles className="w-8 h-8" />}
              color="blue"
            />
            <StepCard
              number="2"
              title="Set Smart Rules"
              description="Configure AI-powered investment rules that match your lifestyle and risk tolerance. Customize everything."
              icon={<BarChart3 className="w-8 h-8" />}
              color="purple"
            />
            <StepCard
              number="3"
              title="Watch It Grow"
              description="Sit back as our AI optimizes your investments automatically. Track progress with real-time insights."
              icon={<TrendingUp className="w-8 h-8" />}
              color="pink"
            />
          </div>

          {/* Process Flow Visualization */}
          <div className="mt-16 flex justify-center">
            <div className="hidden md:flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                1
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                2
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                3
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta-section relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 md:p-16 text-center max-w-5xl mx-auto border border-white/20 shadow-2xl">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                <Rocket className="w-5 h-5 text-white" />
                <span className="text-sm font-semibold text-white">Ready to Start?</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Ready to Start Your
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  Investment Journey?
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of smart investors who are building wealth automatically with AI-powered micro-investments.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="group bg-white text-gray-900 hover:bg-gray-100 shadow-2xl hover:shadow-white/25 transform hover:scale-110 transition-all duration-300 px-12 py-4 text-lg font-bold">
                  <span className="flex items-center gap-3">
                    Get Started Now
                    <div className="relative">
                      <Rocket className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300" />
                      <div className="absolute inset-0 w-6 h-6 bg-blue-500/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                    </div>
                  </span>
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full border-2 border-white/50"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full border-2 border-white/50"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full border-2 border-white/50"></div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">1000+ investors</p>
                  <p className="text-xs opacity-75">already growing wealth</p>
                </div>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Bank-level Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">Instant Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm font-medium">No Hidden Fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="feature-card group relative bg-white rounded-2xl p-8 shadow-lg card-hover border border-gray-100 hover:border-purple-200 transition-all duration-300 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-purple-800 transition-colors">{title}</h3>
        
        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors flex-grow">{description}</p>
        
        {/* Sparkle effects */}
        <div className="absolute top-4 right-4 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-sparkle transition-opacity"></div>
        <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-sparkle animate-delay-300 transition-opacity"></div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description, icon, color }: any) {
  const colorClasses: Record<string, any> = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50/50 to-blue-100/30',
      text: 'text-blue-900',
      accent: 'bg-blue-300'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50/50 to-purple-100/30',
      text: 'text-purple-900',
      accent: 'bg-purple-300'
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      bg: 'from-pink-50/50 to-pink-100/30',
      text: 'text-pink-900',
      accent: 'bg-pink-300'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="step-card relative group">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-white/50 text-center hover:shadow-2xl hover:bg-white/95 transition-all duration-500 relative overflow-hidden h-full">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        <div className="relative z-10 flex flex-col items-center h-full">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white text-3xl font-black mb-8 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 shadow-lg`}>
            {number}
          </div>
          
          <div className="flex justify-center mb-6 text-gray-600 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          
          <h3 className={`text-2xl font-bold mb-6 text-gray-900 group-hover:${colors.text} transition-colors leading-tight`}>{title}</h3>
          
          <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed text-lg flex-grow">{description}</p>
          
          {/* Enhanced floating elements */}
          <div className={`absolute top-6 right-6 w-3 h-3 ${colors.accent} rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300`}></div>
          <div className={`absolute bottom-8 left-8 w-2 h-2 ${colors.accent} rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500`}></div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
}
