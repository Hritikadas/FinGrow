'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RiskQuestionnaire, { RiskProfile } from '@/components/RiskQuestionnaire';
import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RiskLabel from '@/components/RiskLabel';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function RiskAssessmentPage() {
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleComplete = (profile: RiskProfile) => {
    setRiskProfile(profile);
    setShowResults(true);
    
    // Store risk profile in localStorage
    localStorage.setItem('riskProfile', JSON.stringify(profile));
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  if (showResults && riskProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <div className="mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Assessment Complete!</h1>
              <p className="text-gray-300">Your risk profile has been determined</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-center mb-4">
                <RiskLabel riskProfile={riskProfile} size="lg" />
              </div>
              <p className="text-gray-300 mb-6">{riskProfile.description}</p>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Recommended Bundle</h3>
                <p className="text-purple-300 text-xl font-bold capitalize">
                  {riskProfile.recommendedBundle} Bundle
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  This bundle aligns with your risk tolerance and investment goals
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Continue to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/bundles')}
                className="w-full text-gray-300 border-gray-600 hover:border-gray-500"
              >
                View Investment Bundles
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-left">
              <p className="text-sm text-yellow-200">
                <strong>Disclaimer:</strong> This assessment is for educational purposes only. 
                All investment recommendations and returns are simulated. Please consult with a 
                qualified financial advisor for actual investment decisions.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return <RiskQuestionnaire onComplete={handleComplete} onSkip={handleSkip} />;
}