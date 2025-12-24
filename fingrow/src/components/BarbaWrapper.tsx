'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { initBarba, destroyBarba } from '@/lib/barba';

interface BarbaWrapperProps {
  children: React.ReactNode;
  namespace?: string;
  className?: string;
}

export default function BarbaWrapper({ 
  children, 
  namespace = 'default',
  className = ''
}: BarbaWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // Initialize Barba.js only once
    if (!initialized.current) {
      initBarba();
      initialized.current = true;
    }

    // Cleanup on unmount
    return () => {
      if (initialized.current) {
        destroyBarba();
        initialized.current = false;
      }
    };
  }, []);

  // Update data attributes when pathname changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute('data-barba-namespace', namespace);
    }
  }, [namespace, pathname]);

  return (
    <div
      ref={containerRef}
      data-barba="container"
      data-barba-namespace={namespace}
      className={className}
    >
      {children}
    </div>
  );
}