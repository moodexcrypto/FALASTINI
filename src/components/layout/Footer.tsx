// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, ListChecks, Handshake, Loader2, ImagePlus } from 'lucide-react'; // Added ImagePlus icon
import { cn } from '@/lib/utils';
import { useLoading } from '@/context/LoadingContext'; // Import useLoading hook
import { useState, useEffect } from 'react'; // Import useState and useEffect

const navItems = [
  { href: '/', label: 'Donate', icon: Gift },
  { href: '/records', label: 'Records', icon: ListChecks },
  { href: '/solidarity', label: 'Solidarity', icon: ImagePlus }, // New Solidarity Tab
  { href: '/support', label: 'Support Us', icon: Handshake },
];

const Footer = () => {
  const pathname = usePathname();
  const { isLoading, setLoading } = useLoading();
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  // Determine the active tab
  const isActive = (href: string) => {
    // Exact match for home, startsWith for others
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleLinkClick = (href: string) => {
    if (href !== pathname) {
      setLoading(true); // Start loading immediately on click
      setIsNavigating(true);
      setTargetPath(href);
      // The actual navigation happens via the Link component
    }
  };

  // Monitor pathname changes to stop loading state after navigation completes
  useEffect(() => {
    // When navigation completes (pathname matches the target), stop showing loading state
    if (isNavigating && pathname === targetPath) {
        setIsNavigating(false);
        setTargetPath(null);
        // Page components are now responsible for calling setLoading(false) when their data loads
        // setLoading(false); // Removed this to let page components handle it
    }

     // Fallback timeout to reset loading state if it gets stuck
     let timer: NodeJS.Timeout;
     if (isLoading && isNavigating) { // Only run timeout if actively navigating
       timer = setTimeout(() => {
          if (isNavigating) { // Double-check if still navigating
              console.warn("Resetting loading state due to navigation timeout");
              setLoading(false);
              setIsNavigating(false);
              setTargetPath(null);
          }
       }, 5000); // 5 second timeout
     }
     return () => clearTimeout(timer);

  }, [pathname, isNavigating, targetPath, setLoading, isLoading]);


  return (
    <footer className="sticky bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:relative md:border-t-0">
       {/* Main Navigation */}
       <nav className="container mx-auto flex h-16 items-center justify-around px-2 md:h-auto md:justify-center md:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true} // Enable prefetching for faster navigation
              onClick={(e) => {
                 // Prevent triggering loading if already on the page
                 if (pathname === item.href) {
                    e.preventDefault(); // Stop navigation
                    return; // Don't set loading state
                 }
                 handleLinkClick(item.href); // Trigger loading state
              }}
              className={cn(
                'flex flex-col items-center justify-center text-sm font-bold transition-colors h-full w-1/4 md:w-auto px-1 md:px-4 relative', // Adjusted width for 4 items
                isActive(item.href)
                  ? 'text-primary' // Active color (Green)
                  : 'text-muted-foreground hover:text-primary',
                 'btn-hover-glow-green' // Apply glow effect on hover
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
                {/* Active Indicator Bar */}
                 {isActive(item.href) && (
                   <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary"></span>
                 )}

               {/* Show loader if navigating to this item */}
               {isNavigating && targetPath === item.href ? (
                 <Loader2 className="h-5 w-5 mb-1 animate-spin" />
               ) : (
                 <item.icon className="h-5 w-5 mb-1" /> // Slightly smaller icon
               )}
               <span className="text-xs truncate">{item.label}</span>
            </Link>
          ))}
      </nav>
       {/* Attribution Text */}
       <div className="text-center text-xs text-muted-foreground py-2 border-t border-border md:border-t-0">
         Made with 💗 by Asadullah. 🇵🇸
       </div>
    </footer>
  );
};

export default Footer;
