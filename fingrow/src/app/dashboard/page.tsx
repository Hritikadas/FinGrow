'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import Button from '@/components/ui/Button';
import { RiskProfile } from '@/components/RiskQuestionnaire';
import OnboardingTour, { useOnboarding } from '@/components/OnboardingTour';
import gsap from 'gsap';
import { 
  Sparkles,
  Flame,
  Shield,
  AlertTriangle
} from 'lucide-react';

// Lazy load heavy components
const DashboardCharts = dynamic(() => import('@/components/DashboardCharts'), {
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg animate-pulse"></div>
      <div className="h-80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg animate-pulse"></div>
    </div>
  ),
  ssr: false
});

// Cache user data with timestamp
const USER_CACHE_KEY = 'fingrow_user_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getRiskDescription(category: string): string {
  switch (category.toLowerCase()) {
    case 'conservative':
      return 'Low risk tolerance with focus on capital preservation and steady returns.';
    case 'moderate':
      return 'Balanced approach with moderate risk for steady growth potential.';
    case 'aggressive':
      return 'High risk tolerance seeking maximum growth potential over long term.';
    default:
      return 'Risk profile not yet determined.';
  }
}

function getCachedUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.error('Error reading cached user:', error);
  }
  return null;
}

function setCachedUser(userData: any) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
      data: userData,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching user:', error);
  }
}

function getRiskProfile(): RiskProfile | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('riskProfile');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading risk profile:', error);
    return null;
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRiskPrompt, setShowRiskPrompt] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const router = useRouter();

  // Onboarding hook
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const fetchUserData = async () => {
      try {
        // Try to get cached user first
        const cachedUser = getCachedUser();
        if (cachedUser) {
          setUser(cachedUser);
          setCachedUser(cachedUser);
          
          // If user has risk profile data from database, use it
          if (cachedUser.riskCategory && cachedUser.riskScore) {
            const dbRiskProfile = {
              category: cachedUser.riskCategory,
              score: cachedUser.riskScore,
              description: getRiskDescription(cachedUser.riskCategory),
              recommendedBundle: cachedUser.recommendedBundle || 'balanced'
            };
            setRiskProfile(dbRiskProfile);
          } else {
            // Fallback to localStorage risk profile
            const storedRiskProfile = getRiskProfile();
            setRiskProfile(storedRiskProfile);
            
            // Show risk assessment prompt if no profile exists
            if (!storedRiskProfile) {
              setShowRiskPrompt(true);
            }
          }
        } else {
          // Fallback to localStorage
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              setCachedUser(parsedUser);
              
              // Check for database risk profile
              if (parsedUser.riskCategory && parsedUser.riskScore) {
                const dbRiskProfile = {
                  category: parsedUser.riskCategory,
                  score: parsedUser.riskScore,
                  description: getRiskDescription(parsedUser.riskCategory),
                  recommendedBundle: parsedUser.recommendedBundle || 'balanced'
                };
                setRiskProfile(dbRiskProfile);
              } else {
                // Fallback to localStorage risk profile
                const storedRiskProfile = getRiskProfile();
                setRiskProfile(storedRiskProfile);
                
                if (!storedRiskProfile) {
                  setShowRiskPrompt(true);
                }
              }
            } catch (error) {
              console.error('Error parsing user data:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

function getRiskDescription(category: string): string {
  switch (category) {
    case 'conservative':
      return 'Prefers stable, low-risk investments with steady returns';
    case 'moderate':
      return 'Balanced approach with moderate risk for better growth potential';
    case 'aggressive':
      return 'High-risk tolerance for maximum growth opportunities';
    default:
      return 'Risk profile not assessed';
  }
}

  useEffect(() => {
    if (!isLoading && !hasAnimated.current && dashboardRef.current) {
      hasAnimated.current = true;
      
      // Optimized GSAP animations with reduced complexity
      const ctx = gsap.context(() => {
        gsap.set('.dashboard-card', { opacity: 0, y: 30 });
        gsap.set('.dashboard-header', { opacity: 0, y: -20 });
        
        const tl = gsap.timeline();
        
        tl.to('.dashboard-header', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
        .to('.dashboard-card', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }, '-=0.3');
      }, dashboardRef);

      return () => ctx.revert();
    }
  }, [isLoading]);

  const handleTakeAssessment = () => {
    router.push('/risk-assessment');
  };

  const handleSkipAssessment = () => {
    setShowRiskPrompt(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="dashboard-header mb-8">
            <div className="h-8 bg-gray-700 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Risk Assessment Prompt */}
        {showRiskPrompt && (
          <div className="dashboard-card mb-8">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Shield className="h-8 w-8 text-purple-400 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Complete Your Risk Assessment</h3>
                    <p className="text-gray-300 mb-4">
                      Get personalized investment recommendations based on your risk tolerance and financial goals.
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleTakeAssessment}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Take Assessment (2 min)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSkipAssessment}
                        className="text-gray-300 border-gray-600 hover:border-gray-500"
                      >
                        Skip for now
                      </Button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSkipAssessment}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="dashboard-header mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name || 'Investor'}!
            </h1>
          </div>
          <p className="text-gray-300 flex items-center">
            <Flame className="h-4 w-4 mr-2 text-orange-400" />
            Your financial journey is growing stronger every day
          </p>
          
          {/* Educational Notice */}
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-sm text-yellow-200">
                Educational Demo: All data shown is simulated for learning purposes only
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section with Suspense */}
        <div className="dashboard-card">
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg animate-pulse"></div>
              ))}
            </div>
          }>
            <DashboardStats user={user} riskProfile={riskProfile || undefined} />
          </Suspense>
        </div>

        {/* Charts Section */}
        <div className="dashboard-card">
          <DashboardCharts />
        </div>
      </div>
    </div>
  );
}