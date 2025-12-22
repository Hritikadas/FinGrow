'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  PieChart, 
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  action?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to FinGrow! 🎉',
    description: 'Your AI-powered investment companion',
    icon: Sparkles,
    content: (
      <div className="text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Let's get you started!</h3>
          <p className="text-gray-300">
            FinGrow uses AI to analyze your spending, predict your available funds, 
            and help you invest smartly. Let's take a quick tour!
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-200">
            <strong>Educational Demo:</strong> All data shown is simulated for learning purposes. 
            This is not actual financial advice.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Smart Dashboard',
    description: 'AI-powered insights at a glance',
    icon: TrendingUp,
    content: (
      <div>
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Dashboard Features:</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
            <div>
              <p className="text-white font-medium">Investment Overview</p>
              <p className="text-gray-300 text-sm">Track your total investments, returns, and growth</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <div>
              <p className="text-white font-medium">Risk Profile</p>
              <p className="text-gray-300 text-sm">See your risk assessment and recommended bundles</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
            <div>
              <p className="text-white font-medium">AI Predictions</p>
              <p className="text-gray-300 text-sm">Liquidity forecasts and investment recommendations</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'bundles',
    title: 'Investment Bundles',
    description: 'Diversified portfolios for every risk level',
    icon: PieChart,
    content: (
      <div>
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Choose Your Bundle:</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-green-400 font-medium">Safe Bundle</span>
              <span className="text-green-400 text-sm">7% return</span>
            </div>
            <p className="text-gray-300 text-xs">Low risk, stable growth, capital preservation</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-400 font-medium">Balanced Bundle</span>
              <span className="text-blue-400 text-sm">10% return</span>
            </div>
            <p className="text-gray-300 text-xs">Moderate risk, balanced growth and income</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-400 font-medium">Growth Bundle</span>
              <span className="text-purple-400 text-sm">14% return</span>
            </div>
            <p className="text-gray-300 text-xs">High risk, maximum growth potential</p>
          </div>
        </div>
      </div>
    ),
    action: {
      text: 'Explore Bundles',
      href: '/bundles',
    },
  },
  {
    id: 'simulation',
    title: 'Investment Simulator',
    description: 'See your money grow over time',
    icon: Target,
    content: (
      <div>
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Simulation Features:</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Compound Growth</p>
              <p className="text-gray-300 text-sm">See how your investments grow with compound interest</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Flexible Scenarios</p>
              <p className="text-gray-300 text-sm">Adjust amount, duration, and bundle type</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Visual Charts</p>
              <p className="text-gray-300 text-sm">Interactive charts showing month-by-month growth</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-200">
            <strong>Example:</strong> ₹5,000/month for 3 years in Balanced Bundle = 
            ₹1.8L invested → ₹2.1L final value
          </p>
        </div>
      </div>
    ),
    action: {
      text: 'Try Simulator',
      href: '/simulation',
    },
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const currentStepData = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  const handleActionClick = () => {
    if (currentStepData.action?.href) {
      router.push(currentStepData.action.href);
      handleComplete();
    } else if (currentStepData.action?.onClick) {
      currentStepData.action.onClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-sm border-white/20 relative">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Progress bar */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Skip tour
            </button>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-300">
              {currentStepData.description}
            </p>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="text-gray-300 border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-3">
              {currentStepData.action && (
                <Button
                  variant="outline"
                  onClick={handleActionClick}
                  className="text-purple-300 border-purple-600 hover:border-purple-500"
                >
                  {currentStepData.action.text}
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLastStep ? 'Get Started' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hook for managing onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('fingrow_onboarding_completed');
    if (!hasCompletedOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('fingrow_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem('fingrow_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('fingrow_onboarding_completed');
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
}