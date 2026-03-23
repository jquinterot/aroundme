'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, Bell, User } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
}

const mainNav: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Search', href: '/bogota', icon: Search },
  { label: 'Create', href: '/create-event', icon: Plus },
  { label: 'Alerts', href: '/dashboard/notifications', icon: Bell },
  { label: 'Profile', href: '/dashboard', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/bogota';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                active 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${
                active 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                  : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
