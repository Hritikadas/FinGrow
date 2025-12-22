'use client';

import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { RiskProfile } from './RiskQuestionnaire';

interface RiskLabelProps {
  riskProfile: RiskProfile;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export default function RiskLabel({ riskProfile, size = 'md', showDescription = false }: RiskLabelProps) {
  const getRiskConfig = (label: string) => {
    switch (label) {
      case 'Conservative':
        return {
          icon: Shield,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
      case 'Moderate':
        return {
          icon: TrendingUp,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        };
      case 'Aggressive':
        return {
          icon: AlertTriangle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20'
        };
      default:
        return {
          icon: Shield,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'h-3 w-3',
          text: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 'h-5 w-5',
          text: 'text-base'
        };
      default:
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 'h-4 w-4',
          text: 'text-sm'
        };
    }
  };

  const config = getRiskConfig(riskProfile.label);
  const sizeClasses = getSizeClasses();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center space-x-2 rounded-full border ${config.bgColor} ${config.borderColor} ${sizeClasses.container}`}>
      <Icon className={`${config.color} ${sizeClasses.icon}`} />
      <span className={`font-medium ${config.color} ${sizeClasses.text}`}>
        {riskProfile.label}
      </span>
      {showDescription && (
        <div className="ml-2">
          <p className={`text-gray-300 ${sizeClasses.text}`}>
            {riskProfile.description}
          </p>
        </div>
      )}
    </div>
  );
}