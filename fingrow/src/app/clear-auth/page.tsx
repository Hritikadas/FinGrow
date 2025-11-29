'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ClearAuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');

  const clearAuth = async () => {
    try {
      setStatus('Clearing authentication...');
      
      // Call logout API to clear server cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setStatus('✅ Authentication cleared! Redirecting to login...');
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      setStatus('❌ Error clearing authentication');
      console.error(error);
    }
  };

  useEffect(() => {
    // Auto-clear on page load
    clearAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Clear Authentication</h1>
        <p className="text-gray-600 mb-6">{status || 'Clearing cookies and localStorage...'}</p>
        <Button onClick={clearAuth} className="w-full">
          Clear Again
        </Button>
      </Card>
    </div>
  );
}
