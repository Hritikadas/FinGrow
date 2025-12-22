'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  History, 
  MessageCircle,
  Target,
  LogOut,
  Calculator
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear client-side storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/bundles', label: 'Bundles', icon: TrendingUp },
    { href: '/simulation', label: 'Simulate', icon: Target },
    { href: '/scenario-comparison', label: 'Compare', icon: Calculator },
    { href: '/history', label: 'History', icon: History },
    { href: '/chatbot', label: 'AI Chat', icon: MessageCircle },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="nav-logo flex items-center gap-2 group">
            <div className="relative w-16 h-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Image
                src="/images/fingrow-logo.svg"
                alt="FinGrow Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">FinGrow</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button 
            onClick={handleLogout}
            className="nav-logout flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300 rounded-xl font-medium hover:scale-105 hover:shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
