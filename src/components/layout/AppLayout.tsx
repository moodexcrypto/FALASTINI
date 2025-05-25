import React from 'react';
import Footer from './Footer'; // Footer now acts as the bottom tab bar
import { LoadingProvider } from '@/context/LoadingContext'; // Import LoadingProvider
import LoadingIndicator from './LoadingIndicator'; // Import LoadingIndicator

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
       {/* Main content area that scrolls */}
       <main className="flex-1 overflow-y-auto pb-16 md:pb-0"> {/* Add padding-bottom for fixed footer */}
         <div className="container mx-auto px-4 py-6"> {/* Adjusted padding */}
           {children}
         </div>
       </main>

       {/* Footer acting as bottom navigation */}
       <Footer />
     </div>
  );
};

export default AppLayout;
