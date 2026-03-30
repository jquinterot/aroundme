'use client';

import Link from 'next/link';
import { FooterLink, FooterProps } from '@/types/components';

const defaultLinks: FooterLink[] = [
  { label: 'About', href: '#' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/docs' },
  { label: 'Contact', href: '#' },
];

export function Footer({ links = defaultLinks }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm" data-testid="footer-copyright">
            © 2026 AroundMe. Discover your city.
          </p>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400" data-testid="footer-links">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                data-testid={`footer-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
