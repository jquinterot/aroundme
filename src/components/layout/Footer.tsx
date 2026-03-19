'use client';

import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  links?: FooterLink[];
}

const defaultLinks: FooterLink[] = [
  { label: 'About', href: '#' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '#' },
];

export function Footer({ links = defaultLinks }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 AroundMe. Discover your city.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="hover:text-indigo-600 transition-colors"
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
