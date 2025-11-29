'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Button from './ui/Button';
import gsap from 'gsap';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  History, 
  MessageCircle,
  Target,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav-logo', {
        opacity: 0,
        x: -15,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.from('.nav-item', {
        opacity: 0,
        y: -8,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.out',
        delay: 0.1,
      });

      gsap.from('.nav-logout', {
        opacity: 0,
        x: 15,
        duration: 0.3,
        ease: 'power2.out',
        delay: 0.2,
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

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
    { href: '/history', label: 'History', icon: History },
    { href: '/chatbot', label: 'AI Chat', icon: MessageCircle },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav ref={navRef} className="glass-effect border-b sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="nav-logo flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">FinGrow</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="nav-logout hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
