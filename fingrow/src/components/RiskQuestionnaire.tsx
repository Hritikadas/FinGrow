'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AlertTriangle, Shield, TrendingUp, Info } from 'lucide-react';

interface RiskQuestionnaireProps {
  onComplete: (riskProfile: RiskProfile) => void;
  onSkip?: () => void;
}

export interface RiskProfile {
  score: number;
  label: 'Conservative' | 'Moderate' | 'Aggressive';
  description: string;
  recommendedBundle: 'safe' | 'balanced' | 'growth';
}

const questions = [
  {
    id: 1,
    question: "What is your age group?",
    options: [
      { text: "18-25 years", score: 3 },
      { text: "26-35 years", score: 3 },
      { text: "36-45 years", score: 2 },
      { text: "46-55 years", score: 1 },
      { text: "55+ years", score: 0 }
    ]
  },
  {
    id: 2,
    question: "What is your investment experience?",
    options: [
      { text: "No prior investment experience", score: 0 },
      { text: "Limited experience (< 2 years)", score: 1 },
      { text: "Moderate experience (2-5 years)", score: 2 },
      { text: "Experienced investor (5+ years)", score: 3 }
    ]
  },
  {
    id: 3,
    question: "How would you react if your investment lost 20% in a month?",
    options: [
      { text: "Panic and sell immediately", score: 0 },
      { text: "Feel worried but hold", score: 1 },
      { text: "Stay calm and wait", score: 2 },
      { text: "See it as a buying opportunity", score: 3 }
    ]
  },
  {
    id: 4,
    question: "What is your primary investment goal?",
    options: [
      { text: "Capital preservation", score: 0 },
      { text: "Steady income generation", score: 1 },
      { text: "Balanced growth and income", score: 2 },
      { text: "Maximum capital growth", score: 3 }
    ]
  },
  {
    id: 5,
    question: "What is your investment time horizon?",
    options: [
      { text: "Less than 1 year", score: 0 },
      { text: "1-3 years", score: 1 },
      { text: "3-7 years", score: 2 },
      { text: "More than 7 years", score: 3 }
    ]
  }
];

export default function RiskQuestionnaire({ onComplete, onSkip }: RiskQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate risk profile
      const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
      const maxScore = questions.length * 3;
      const percentage = (totalScore / maxScore) * 100;

      let riskProfile: RiskProfile;

      if (percentage <= 40) {
        riskProfile = {
          score: totalScore,
          label: 'Conservative',
          description: 'You prefer stability and capital preservation over high returns. Low-risk investments suit you best.',
          recommendedBundle: 'safe'
        };
      } else if (percentage <= 70) {
        riskProfile = {
          score: totalScore,
          label: 'Moderate',
          description: 'You seek a balance between growth and stability. Moderate-risk investments align with your goals.',
          recommendedBundle: 'balanced'
        };
      } else {
        riskProfile = {
          score: totalScore,
          label: 'Aggressive',
          description: 'You are comfortable with volatility for potentially higher returns. Growth-focused investments suit you.',
          recommendedBundle: 'growth'
        };
      }

      onComplete(riskProfile);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-sm border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-2xl font-bold text-white">Risk Assessment</h1>
          </div>
          <p className="text-gray-300">
            Help us understand your investment preferences to recommend suitable options
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  selectedOption === index
                    ? 'border-purple-400 bg-purple-500/20 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onSkip}
            className="text-gray-400 border-gray-600 hover:border-gray-500"
          >
            Skip Assessment
          </Button>

          <Button
            onClick={() => selectedOption !== null && handleAnswer(questions[currentQuestion].options[selectedOption].score)}
            disabled={selectedOption === null}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">Important Disclaimer</p>
              <p>
                This risk assessment is for educational purposes only. All investment returns shown (7%, 10%, 14%) 
                are simulated examples and not guaranteed. FinGrow is a prototype for demonstration purposes only.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}