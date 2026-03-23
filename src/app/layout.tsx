import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { MobileNav } from '@/components/layout/MobileNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'AroundMe | Discover Events in Your City',
  description: 'Find and explore events, activities, and experiences happening in your city. Free and paid events, concerts, workshops, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
