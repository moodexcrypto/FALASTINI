import type { Metadata, Viewport } from 'next'; // Import Viewport
import { Inter, Amiri, Noto_Kufi_Arabic } from 'next/font/google'; // Import Inter, Amiri, and Noto Kufi Arabic
import { GeistSans } from 'geist/font/sans'; // Import Geist Sans
// Removed GeistMono import
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppLayout from '@/components/layout/AppLayout'; // Import the new layout
import { LoadingProvider } from '@/context/LoadingContext'; // Import LoadingProvider
import LoadingIndicator from '@/components/layout/LoadingIndicator'; // Import LoadingIndicator

// Define Inter font instance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Improve font loading performance
  variable: '--font-inter', // Assign a CSS variable
});

// Define Amiri font instance (for Arabic text)
const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'], // Specify weights you'll use
  display: 'swap',
  variable: '--font-amiri', // Assign a CSS variable
});

// Define Noto Kufi Arabic font instance
const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'], // Specify weights
  display: 'swap',
  variable: '--font-noto-kufi', // Assign a CSS variable
});


export const metadata: Metadata = {
  title: 'Falastini - Support Palestine',
  description: 'Donate, watch ads, read stories, and support the people of Gaza and Palestine.',
  manifest: '/manifest.json', // Added manifest for PWA
  themeColor: '#111827', // Dark theme color for PWA
  appleWebApp: { // iOS PWA settings
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Falastini',
  },
};

// Add viewport configuration to disable zoom
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Disable zooming
  userScalable: false, // Disable zooming
  themeColor: '#111827', // Ensure theme color consistency
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply font variables to html tag
    <html lang="en" className={`${inter.variable} ${amiri.variable} ${notoKufiArabic.variable} ${GeistSans.variable} dark`}>
       <head>
          {/* Add preconnect hints for faster loading */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
       <body className="antialiased font-sans select-none"> {/* Apply font-sans and disable text selection */}
        <LoadingProvider>
          <LoadingIndicator /> {/* Display loading indicator */}
          <AppLayout> {/* Wrap children with the AppLayout */}
            {children}
          </AppLayout>
          <Toaster />
        </LoadingProvider>
       </body>
    </html>
  );
}
