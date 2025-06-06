import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ReactNode } from 'react';
import { defaultMetadata } from '@/common/metadata';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';

const siteFont = localFont({
  src: './fonts/JetBrainsMono.ttf',
  weight: '100 900',
});

export const metadata: Metadata = defaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${siteFont.className} antialiased w-full h-full`}>
        <Toaster />
        <TooltipProvider>
          <QueryProvider>
            <main className='flex flex-col min-h-screen text-white w-full'>{children}</main>
          </QueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
