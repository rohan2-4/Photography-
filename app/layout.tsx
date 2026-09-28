import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cinemayur | Premium Photography & Event Booking Studio',
  description: 'Capturing Your Moments, Creating Your Story. Professional photography and cinematic experiences for weddings, celebrations, pre-wedding films, and corporate events.',
  keywords: ['Cinemayur', 'Wedding Photography', 'Cinematic Wedding Film', 'Pre-Wedding Shoot', 'Maternity Photography', 'Photographer Booking'],
  authors: [{ name: 'Cinemayur Studio' }],
  openGraph: {
    title: 'Cinemayur | Premium Photography & Event Booking',
    description: 'Capturing Your Moments, Creating Your Story. Luxury wedding photography and cinematic films.',
    siteName: 'Cinemayur',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#08090D] text-slate-100 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
