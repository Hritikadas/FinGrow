'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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

      // Feature cards scroll animation - faster
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });

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
        <div className="blob-1 absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="blob-2 absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="blob-3 absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Investment Platform</span>
          </div>
          
          <h1 className="hero-title text-6xl md:text-8xl font-bold gradient-text mb-6">
            FinGrow
          </h1>
          
          <p className="hero-subtitle text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Automate. Invest. Grow. Repeat.
          </p>
          
          <p className="hero-description text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your spare change into wealth with AI-powered micro-investments. 
            Start building your financial future today, one rupee at a time.
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="group">
                <span className="flex items-center gap-2">
                  Login
                  <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="hero-stats text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary-600">7-14%</p>
              <p className="text-sm text-gray-600 mt-1">Annual Returns</p>
            </div>
            <div className="hero-stats text-center">
              <p className="text-3xl md:text-4xl font-bold text-purple-600">AI-Driven</p>
              <p className="text-sm text-gray-600 mt-1">Smart Analysis</p>
            </div>
            <div className="hero-stats text-center">
              <p className="text-3xl md:text-4xl font-bold text-pink-600">₹1+</p>
              <p className="text-sm text-gray-600 mt-1">Start Investing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="features-section relative container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need to grow your wealth automatically</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Smart Automation"
            description="Round-up rules, percentage investing, and end-of-month sweeps"
            color="blue"
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="AI Predictions"
            description="Predict liquidity and optimize investment timing with ML"
            color="purple"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Risk Management"
            description="Diversified bundles tailored to your unique risk profile"
            color="green"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Goal Planning"
            description="Set financial goals and track progress with AI insights"
            color="pink"
          />
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="steps-section relative container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Start investing in 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard
            number="1"
            title="Sign Up"
            description="Create your account and set your financial goals in minutes"
            icon={<Sparkles className="w-6 h-6" />}
          />
          <StepCard
            number="2"
            title="Set Rules"
            description="Configure auto-investment rules that match your lifestyle"
            icon={<BarChart3 className="w-6 h-6" />}
          />
          <StepCard
            number="3"
            title="Watch It Grow"
            description="Sit back as AI optimizes your investments automatically"
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section relative container mx-auto px-4 py-20">
        <div className="glass-effect rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of smart investors who are building wealth automatically
          </p>
          <Link href="/signup">
            <Button size="lg" className="group">
              <span className="flex items-center gap-2">
                Get Started Now
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
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
    <div className="feature-card group relative bg-white rounded-2xl p-6 shadow-lg card-hover border border-gray-100">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon }: any) {
  return (
    <div className="step-card relative">
      <div className="bg-white rounded-2xl p-8 shadow-lg card-hover border border-gray-100 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {number}
        </div>
        <div className="flex justify-center mb-3 text-primary-600">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
