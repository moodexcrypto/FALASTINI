
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Handshake, Share2, Loader2, Info, Youtube, Instagram, Facebook as FacebookIcon, Send as TelegramIcon } from 'lucide-react'; // Added Info, Youtube, Instagram, FacebookIcon, Send icons
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/context/LoadingContext'; // Import useLoading hook


export default function SupportPage() {
  const { toast } = useToast();
  const { setLoading } = useLoading(); // Use loading context
  const [isSharing, setIsSharing] = useState(false);

  // Function to handle sharing the app link
  const handleShare = async () => {
    setIsSharing(true);
    setLoading(true); // Show loading indicator
    const shareData = {
      title: 'Falastini - Support Palestine',
      text: 'Join me in supporting Palestine through the Falastini app. Donate, watch ads, or just share to raise awareness.',
      url: window.location.origin, // Share the base URL of the app
    };
    try {
        // Add a small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 300));

      if (navigator.share) {
        await navigator.share(shareData);
        toast({ title: "Link Shared!", description: "Thanks for spreading the word." });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link Copied!", description: "App link copied to clipboard. Please share it!" });
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Only show error toast if it's not an AbortError (user cancellation)
       if (err instanceof Error && err.name !== 'AbortError') {
          toast({ title: "Sharing Failed", description: "Could not share the link.", variant: "destructive" });
       } else {
            // Optionally show a neutral message if user cancelled
            // toast({ title: "Sharing Cancelled", variant: "default" });
       }
    } finally {
      setIsSharing(false);
      setLoading(false); // Hide loading indicator
    }
  };

  // Placeholder links - Replace with actual links
  const socialLinks = {
      youtube: 'https://youtube.com/@falastiniapp',
      instagram: 'https://instagram.com/falastiniapp',
      facebook: 'https://www.facebook.com/profile.php?id=61576666533137',
      telegram: 'https://t.me/falastiniapp',
  };


  return (
    <div className="space-y-8 max-w-2xl mx-auto py-8"> {/* Added padding */}
      <h1 className="text-2xl font-bold text-center text-foreground mb-6 flex items-center justify-center gap-2">
         <Handshake className="h-6 w-6" /> Support Falastini Beyond Donations
      </h1>
       <CardDescription className="text-center text-muted-foreground -mt-6 mb-8 px-4">
         Connect with us, share our mission, and help amplify the voices of Palestine.
       </CardDescription>

      {/* How It Works Section */}
       <Card className="bg-card border-none shadow-none">
           <CardHeader className="p-4 pb-2 text-center">
               <CardTitle className="text-lg font-bold flex items-center justify-center gap-2"><Info className="h-5 w-5 text-primary" /> How Your Support Works</CardTitle>
               <CardDescription className="text-sm">Transparency in fund allocation.</CardDescription>
           </CardHeader>
           <CardContent className="p-4 pt-2 text-sm text-center text-muted-foreground space-y-2">
               <p>
                  <span className="font-bold text-primary">90%</span> of all funds raised (including estimated ad revenue) go directly to verified humanitarian aid efforts in Palestine. This includes food, medical supplies, shelter, and support for affected families.
               </p>
               <p>
                  <span className="font-bold text-accent">10%</span> is allocated towards essential app maintenance, server costs, and minimal operational fees to keep this platform running effectively and securely.
               </p>
                <p className="text-xs opacity-80">We strive to maximize the impact of every contribution.</p>
           </CardContent>
       </Card>


      {/* Social Media Links Card */}
      <Card className="bg-card border-none shadow-none">
        <CardHeader className="p-4 pb-2 text-center">
          <CardTitle className="text-lg font-bold">Connect & Spread Awareness</CardTitle>
          <CardDescription className="text-sm">Follow us and share our updates.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex flex-wrap justify-center gap-3 sm:gap-4">
           {/* YouTube */}
           <Button
             asChild
             variant="outline"
             className="flex flex-col items-center justify-center h-24 w-24 p-3 text-foreground hover:text-primary transition-colors btn-hover-glow-green border-border hover:border-primary"
           >
             <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube">
               <Youtube className="h-8 w-8 mb-1" />
               <span className="text-xs mt-1">YouTube</span>
             </a>
           </Button>
          {/* Instagram */}
           <Button
             asChild
             variant="outline"
             className="flex flex-col items-center justify-center h-24 w-24 p-3 text-foreground hover:text-primary transition-colors btn-hover-glow-green border-border hover:border-primary"
           >
             <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">
               <Instagram className="h-8 w-8 mb-1" />
               <span className="text-xs mt-1">Instagram</span>
             </a>
           </Button>
           {/* Facebook */}
           <Button
             asChild
             variant="outline"
             className="flex flex-col items-center justify-center h-24 w-24 p-3 text-foreground hover:text-primary transition-colors btn-hover-glow-green border-border hover:border-primary"
           >
             <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Follow on Facebook">
               <FacebookIcon className="h-8 w-8 mb-1" />
               <span className="text-xs mt-1">Facebook</span>
             </a>
           </Button>
           {/* Telegram */}
           <Button
             asChild
             variant="outline"
             className="flex flex-col items-center justify-center h-24 w-24 p-3 text-foreground hover:text-primary transition-colors btn-hover-glow-green border-border hover:border-primary"
           >
             <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" aria-label="Join on Telegram">
               <TelegramIcon className="h-8 w-8 mb-1" />
               <span className="text-xs mt-1">Telegram</span>
             </a>
           </Button>
        </CardContent>
      </Card>

      {/* Share App Card */}
       <Card className="bg-card border-none shadow-none">
         <CardHeader className="p-4 pb-2 text-center">
           <CardTitle className="text-lg font-bold">Share This App</CardTitle>
           <CardDescription className="text-sm">Help us reach more people by sharing.</CardDescription>
         </CardHeader>
         <CardContent className="p-4 pt-2 text-center">
            <Button onClick={handleShare} size="lg" className="w-full sm:w-auto btn-hover-glow-green rounded-none border border-primary" variant="default" disabled={isSharing}>
                {isSharing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Share2 className="mr-2 h-5 w-5" />}
                {isSharing ? 'Sharing...' : 'Share the App'}
            </Button>
         </CardContent>
       </Card>

       {/* Removed Support Form */}
    </div>
  );
}

