'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-b border-yellow-500/40 px-4 py-3 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div className="text-sm text-gray-800">
            <span className="font-semibold text-yellow-800">Educational Prototype:</span>
            {' '}All returns (7%, 10%, 14%) are simulated examples. FinGrow is for demonstration purposes only and not actual financial advice.
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-700 hover:text-yellow-800 transition-colors p-1 rounded-full hover:bg-yellow-200/50"
          aria-label="Dismiss disclaimer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}