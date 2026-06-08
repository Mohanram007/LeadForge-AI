import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'LeadForge AI — Find Businesses That Need AI Services',
  description:
    'Discover local businesses, analyze their websites, identify AI automation opportunities, and generate personalized outreach emails instantly.',
  keywords: 'AI leads, lead generation, business discovery, AI automation, cold outreach',
  openGraph: {
    title: 'LeadForge AI — Find Businesses That Need AI Services',
    description: 'Discover local businesses that need AI services in minutes.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-slate-950 text-white antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
