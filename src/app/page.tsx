'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Users, Eye, Copy, Check, Banknote, CreditCard, HeartHandshake, RefreshCw, Loader2, PlayCircle, Timer, Share2, UsersRound, Quote as QuoteIcon } from 'lucide-react'; // Removed QrCode
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, limit, orderBy, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { useLoading } from '@/context/LoadingContext';
import { Separator } from '@/components/ui/separator';

// --- Local Storage Key ---
const USER_AD_DONATIONS_KEY = 'falastini_user_ad_donations';

// --- Sample Quotes/Ayat ---
const sampleQuotes = [
    { id: '1', arabic: "مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً ۚ", english: "Who is it that will loan Allah a goodly loan so He may multiply it for him many times over?", source: "Surah Al-Baqarah 2:245" },
    { id: '2', arabic: "الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ۗ وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ", english: "The example of those who spend their wealth in the way of Allah is like a seed... Allah multiplies for whom He wills.", source: "Surah Al-Baqarah 2:261" },
    { id: '3', arabic: "وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ ۖ وَهُوَ خَيْرُ الرَّازِقِينَ", english: "And whatever you spend in good, it will be repaid to you in full.", source: "Surah Al-Baqarah 2:272" },
    { id: '4', arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَأَطِيعُوا الرَّسُولَ لَعَلَّكُمْ تُرْحَمُونَ", english: "Establish prayer and give zakat and obey the Messenger that you may receive mercy.", source: "Surah An-Nur 24:56" },
    { id: '5', arabic: "وَأَنفِقُوا فِي سَبِيلِ اللَّهِ وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ ۛ", english: "And spend in the way of Allah and do not throw yourselves with your own hands into destruction.", source: "Surah Al-Baqarah 2:195" },
    { id: '6', arabic: "الَّذِينَ يُنفِقُونَ أَمْوَالَهُم بِاللَّيْلِ وَالنَّهَارِ سِرًّا وَعَلَانِيَةً فَلَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ", english: "Those who spend their wealth day and night, secretly and publicly – they will have their reward with their Lord.", source: "Surah Al-Baqarah 2:274" },
    { id: '7', arabic: "لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ ۚ", english: "You will never attain righteousness until you spend from that which you love.", source: "Surah Aal-E-Imran 3:92" },
    { id: '8', arabic: "إِنَّ الْمُصَّدِّقِينَ وَالْمُصَّدِّقَاتِ وَأَقْرَضُوا اللَّهَ قَرْضًا حَسَنًا يُضَاعَفُ لَهُمْ", english: "Indeed, the men who practice charity and the women who practice charity... it will be multiplied for them.", source: "Surah Al-Hadid 57:18" },
    { id: '9', arabic: "وَمَا تُنفِقُوا مِن شَيْءٍ فَإِنَّ اللَّهَ بِهِ عَلِيمٌ", english: "Whatever you spend in the cause of Allah will be repaid to you in full.", source: "Surah Al-Anfal 8:60" },
    { id: '10', arabic: "وَيُطْعِمُونَ الطَّعَامَ عَلَىٰ حُبِّهِ مِسْكِينًا وَيَتِيمًا وَأَسِيرًا", english: "And they give food in spite of love for it to the needy, the orphan, and the captive.", source: "Surah Al-Insan 76:8" },
    { id: '11', arabic: "", english: "Charity does not decrease wealth.", source: "Prophet Muhammad ﷺ (Sahih Muslim)" },
    { id: '12', arabic: "", english: "Protect yourself from hellfire even with half of a date in charity.", source: "Prophet Muhammad ﷺ (Bukhari & Muslim)" },
    { id: '13', arabic: "", english: "The believer’s shade on the Day of Judgment will be his charity.", source: "Prophet Muhammad ﷺ (Tirmidhi)" },
    { id: '14', arabic: "", english: "Every day, angels descend saying: ‘O Allah, give the one who spends a replacement...’", source: "Prophet Muhammad ﷺ (Bukhari)" },
    { id: '15', arabic: "", english: "Give charity without delay, for it stands in the way of calamity.", source: "Prophet Muhammad ﷺ (Tirmidhi)" },
    { id: '16', arabic: "", english: "Smiling at your brother is charity.", source: "Prophet Muhammad ﷺ (Tirmidhi)" },
    { id: '17', arabic: "", english: "Whoever relieves a believer’s distress, Allah will relieve his on the Day of Judgment.", source: "Prophet Muhammad ﷺ (Muslim)" },
    { id: '18', arabic: "", english: "Allah helps the servant as long as the servant helps his brother.", source: "Prophet Muhammad ﷺ (Muslim)" },
    { id: '19', arabic: "", english: "Give, even when you fear poverty.", source: "Umar ibn Al-Khattab (RA)" },
    { id: '20', arabic: "", english: "The upper hand is better than the lower hand.", source: "Prophet Muhammad ﷺ" },
    { id: '21', arabic: "", english: "Sadaqah extinguishes sin as water extinguishes fire.", source: "Prophet Muhammad ﷺ (Tirmidhi)" },
    { id: '22', arabic: "", english: "Your wealth is not decreased by charity. Allah will replace it.", source: "Prophet Muhammad ﷺ" },
    { id: '23', arabic: "", english: "A man is not a believer who fills his stomach while his neighbor is hungry.", source: "Prophet Muhammad ﷺ (Musnad Ahmad)" },
    { id: '24', arabic: "", english: "He is not one of us who is not merciful to others.", source: "Prophet Muhammad ﷺ" },
    { id: '25', arabic: "", english: "Spend and do not fear poverty.", source: "Prophet Muhammad ﷺ" },
    { id: '26', arabic: "", english: "When a man dies, his deeds come to an end except for three... Sadaqah Jariyah.", source: "Prophet Muhammad ﷺ (Muslim)" },
    { id: '27', arabic: "", english: "Do not withhold your money, for if you did, Allah would withhold His blessings.", source: "Prophet Muhammad ﷺ (Bukhari)" },
    { id: '28', arabic: "", english: "The best charity is giving when you are healthy and afraid of poverty.", source: "Prophet Muhammad ﷺ (Bukhari)" },
    { id: '29', arabic: "", english: "Allah loves those who give to the needy, orphans, and captives.", source: "Surah Al-Insan 76:8" },
    { id: '30', arabic: "", english: "Be merciful to others and you will receive mercy from Allah.", source: "Prophet Muhammad ﷺ (Tirmidhi)" },
];


// --- Daily Quote Component ---
const DailyQuote = () => {
    const [quote, setQuote] = useState<(typeof sampleQuotes)[0] | null>(null);
    const [randomNumber, setRandomNumber] = useState<number | null>(null);

     useEffect(() => {
        // Generate random number only on client-side after mount
        setRandomNumber(Math.random());
    }, []);


    useEffect(() => {
         if (randomNumber !== null) {
             const randomIndex = Math.floor(randomNumber * sampleQuotes.length);
             setQuote(sampleQuotes[randomIndex]);
         }
    }, [randomNumber]);

    if (!quote) return null;

    // Style similar to the image provided
    return (
        <div className="w-full text-center my-8 group relative px-4">
             {/* Large Opening Quote SVG */}
             <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 fill-current text-muted-foreground/30 -translate-x-2 -translate-y-4">
                 <path d="M24.3,77.1c0,5.3,1.5,9.7,4.5,13.1s6.8,5.1,11.3,5.1c4.1,0,7.7-1.3,10.8-3.9s4.7-6.1,4.7-10.5c0-4.1-1.5-7.8-4.5-11.1 s-6.8-5-11.3-5c-4.1,0-7.7,1.3-10.8,3.9S24.3,72.4,24.3,77.1z M60.9,77.1c0,5.3,1.5,9.7,4.5,13.1s6.8,5.1,11.3,5.1 c4.1,0,7.7-1.3,10.8-3.9s4.7-6.1,4.7-10.5c0-4.1-1.5-7.8-4.5-11.1s-6.8-5-11.3-5c-4.1,0-7.7,1.3-10.8,3.9S60.9,72.4,60.9,77.1z M24.3,22.9c0,5.3,1.5,9.7,4.5,13.1s6.8,5.1,11.3,5.1c4.1,0,7.7-1.3,10.8-3.9s4.7-6.1,4.7-10.5c0-4.1-1.5-7.8-4.5-11.1 S37.1,7.9,32.7,7.9c-4.1,0-7.7,1.3-10.8,3.9S24.3,18.2,24.3,22.9z M60.9,22.9c0,5.3,1.5,9.7,4.5,13.1s6.8,5.1,11.3,5.1 c4.1,0,7.7-1.3,10.8-3.9s4.7-6.1,4.7-10.5c0-4.1-1.5-7.8-4.5-11.1S77.7,7.9,73.3,7.9c-4.1,0-7.7,1.3-10.8,3.9S60.9,18.2,60.9,22.9z"/>
             </svg>

              {/* Arabic Text (if exists) */}
              {quote.arabic && (
                  <p className={`font-arabic text-3xl md:text-4xl font-bold mb-3 transition-colors duration-300 text-primary`}> {/* Always green */}
                      {quote.arabic}
                  </p>
              )}

              {/* English Translation */}
              <p className={`text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tight leading-tight ${quote.english && !quote.arabic ? 'text-foreground' : 'text-foreground'}`}>
                 {quote.english}
              </p>

             {/* Large Closing Quote SVG */}
             <svg viewBox="0 0 100 100" className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 fill-current text-muted-foreground/30 translate-x-2 translate-y-8 rotate-180">
                  <path d="M24.3,77.1c0,5.3,1.5,9.7,4.5,13.1s6.8,5.1,11.3,5.1c4.1,0,7.7-1.3,10.8-3.9s4.7-6.1,4.7-10.5c0-4.1-1.5-7.8-4.5-11.1 s-6.8-5-11.3-5c-4.1,0-7.7,1.3-10.8,3.9S24.3,72.4,24.3,77.1z M60.9,77.1c0,5.3,1.5,9.7,4.5,13.1s6.8,5.1,11.3,5.1 c4.1,0,7.7-1.3,10.8-3.9s4.7-6.1,4.7-10.5c0-4.1-1.5-7.8-4.5-11.1s-6.8-5-11.3-5c-4.1,0-7.7,1.3-10.8,3.9S60.9,72.4,60.9,77.1z M24.3,22.9c0,5.3,1.5,9.7,4.5,13.1s6.8,5.1,11.3,5.1c4.1,0,7.7-1.3,10.8-3.9s4.7-6.1,4.7-10.5c0-4.1-1.5-7.8-4.5-11.1 S37.1,7.9,32.7,7.9c-4.1,0-7.7,1.3-10.8,3.9S24.3,18.2,24.3,22.9z M60.9,22.9c0,5.3,1.5,9.7,4.5,13.1s6.8,5.1,11.3,5.1 c4.1,0,7.7-1.3,10.8-3.9s4.7-6.1,4.7-10.5c0-4.1-1.5-7.8-4.5-11.1S77.7,7.9,73.3,7.9c-4.1,0-7.7,1.3-10.8,3.9S60.9,18.2,60.9,22.9z"/>
             </svg>

              {/* Source */}
              <p className="text-sm text-muted-foreground mt-6">— {quote.source}</p>
         </div>
     );
 };

// --- Adsterra Ad Links ---
const adLinks = [
    "https://www.profitableratecpm.com/crp7v4jp?key=ff9e01ea08a0a12664942c10934eea34",
    "https://www.profitableratecpm.com/f7vwpq885?key=39fbb62899e96c54e2721de41252ce7f",
    "https://www.profitableratecpm.com/pv6wuika?key=9cf3950caa9e298f4748843dc6fb71ed",
    "https://www.profitableratecpm.com/muc9wnng?key=1f4577e4540d211e6b6c283abf7bbaba",
    "https://www.profitableratecpm.com/a4bpcrdtj?key=d1f8578a4e81535945651207c28fea06",
];

// --- Crypto Wallet Data ---
const cryptoWallets = [
    { name: 'Bitcoin (BTC)', address: '18sjggAZxKqQwNMNPUpphV2Bycq3Tu6wAs' },
    { name: 'Ethereum (ETH/ERC20)', address: '0x47fbb266ecedfc9cec4b0f64e41b0ebd5d389a69' },
    { name: 'USDT (TRC20)', address: 'TE2Bjc68Wr64ch4aq7MRySoB4idJv1HqNw' },
];

// --- Bank Details ---
const bankDetails = {
    accountName: 'MUHAMMAD ASADULLAH',
    accountNumber: '03297217576',
    iban: 'PK51SADA0000003297217576',
    bankName: 'SADAPAY',
    swift: 'N/A', // Keep N/A if not applicable
    binanceUID: '944870578',
};


export default function DonatePage() {
    const { toast } = useToast();
    const { setLoading } = useLoading();
    const [adWatchedCount, setAdWatchedCount] = useState(0);
    const [estimatedRevenueThisSession, setEstimatedRevenueThisSession] = useState(0.00); // Tracks ad revenue within the current session for the ad section display
    const [lastAdRevenue, setLastAdRevenue] = useState(0.00);
    const [isWatchingAd, setIsWatchingAd] = useState(false); // State for ad simulation process
    const [isAdModalOpen, setIsAdModalOpen] = useState(false); // State for ad modal visibility
    const [adTimer, setAdTimer] = useState<number | null>(null); // Timer countdown display
    const [currentAdLink, setCurrentAdLink] = useState<string | null>(null); // Which ad link to display
    const [adIframeKey, setAdIframeKey] = useState(0); // Key to force iframe reload
    const [donationMessage, setDonationMessage] = useState('');
    const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
    const [stats, setStats] = useState({ userDonations: 0.00, totalFunds: 59.00, totalDonors: 2580 }); // Initial TotalRaised = $59
    const [statsLoading, setStatsLoading] = useState(true);
    const [userAdDonationsTotal, setUserAdDonationsTotal] = useState(0.00); // State to track user's total donations from ads
    const [isSharing, setIsSharing] = useState(false); // State for share button

    // --- Load 'Your Donations' from Local Storage on Mount ---
     useEffect(() => {
         if (typeof window !== 'undefined') {
             const storedDonations = localStorage.getItem(USER_AD_DONATIONS_KEY);
             if (storedDonations) {
                 const amount = parseFloat(storedDonations);
                 if (!isNaN(amount)) {
                    setUserAdDonationsTotal(amount);
                    // Update the stats display immediately
                     setStats(prevStats => ({
                         ...prevStats,
                         userDonations: amount,
                     }));
                 }
             }
         }
     }, []); // Run only once on mount

     // --- Save 'Your Donations' to Local Storage on Change ---
     useEffect(() => {
         if (typeof window !== 'undefined') {
             localStorage.setItem(USER_AD_DONATIONS_KEY, userAdDonationsTotal.toString());
         }
     }, [userAdDonationsTotal]);


    // --- Fetch and Simulate Stats Growth ---
     useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            setLoading(true);
            try {
                // Base values (Total Raised starts at 59)
                let baseFunds = 59.00;
                let baseDonors = 2580;
                 let userDonationAmount = 0.00; // Default

                 // Read from localStorage on client
                 if (typeof window !== 'undefined') {
                     const storedDonations = localStorage.getItem(USER_AD_DONATIONS_KEY);
                     if (storedDonations) {
                         const amount = parseFloat(storedDonations);
                         if (!isNaN(amount)) {
                             userDonationAmount = amount;
                         }
                     }
                 }

                // Simulate random increments only after component mounts (client-side)
                const fundIncrement = Math.random() * 5 + 1; // $1-$6 increment
                const donorIncrement = Math.random() < 0.5 ? (Math.random() < 0.7 ? 1 : 0) : (Math.random() < 0.9 ? 2 : 1) ; // 0, 1 or 2 new donors

                const newTotalFunds = baseFunds + fundIncrement;
                const newTotalDonors = baseDonors + donorIncrement;

                // Update stats state, using the userDonationAmount read from localStorage
                setStats({
                    userDonations: userDonationAmount, // Use value from local storage
                    totalFunds: parseFloat(newTotalFunds.toFixed(2)), // Ensure 2 decimal places
                    totalDonors: newTotalDonors,
                });

            } catch (error) {
                console.error("Error fetching/simulating stats: ", error);
                 // Read from localStorage again on error for user donations
                 let userDonationAmountOnError = 0.00;
                 if (typeof window !== 'undefined') {
                     const storedDonations = localStorage.getItem(USER_AD_DONATIONS_KEY);
                     if (storedDonations) {
                         const amount = parseFloat(storedDonations);
                         if (!isNaN(amount)) {
                            userDonationAmountOnError = amount;
                         }
                     }
                 }
                 setStats({ userDonations: userDonationAmountOnError, totalFunds: 59.00, totalDonors: 2580 }); // Reset base, keep user donations
            } finally {
                setStatsLoading(false);
                setLoading(false);
            }
        };
        fetchStats();
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []); // Re-run only on mount

     // Update the displayed user donation stat whenever userAdDonationsTotal changes (redundant due to other effects, but safe)
     useEffect(() => {
        setStats(prevStats => ({
            ...prevStats,
            userDonations: parseFloat(userAdDonationsTotal.toFixed(2)), // Update user donation display based on ad revenue
        }));
     }, [userAdDonationsTotal]);


    // --- Ad Watching ---
    const handleAdWatched = useCallback(async (revenue: number) => {
        console.log(`Ad watched simulation complete! Revenue: $${revenue}`);
        setIsWatchingAd(false); // Ad process finished
        setIsAdModalOpen(false); // Close the modal
        setAdTimer(null); // Reset timer display
        setCurrentAdLink(null); // Clear current ad link

        const newCount = adWatchedCount + 1;
        setAdWatchedCount(newCount);
        const newSessionRevenue = estimatedRevenueThisSession + revenue;
        setEstimatedRevenueThisSession(newSessionRevenue); // Update session's ad revenue display
        setLastAdRevenue(revenue); // Store the revenue from the last watched ad

        // Update total ad revenue for the user (this will trigger save to localStorage)
        const newUserTotalAdRevenue = userAdDonationsTotal + revenue;
        setUserAdDonationsTotal(newUserTotalAdRevenue);

        // Update total funds stat immediately
        setStats(prevStats => ({
            ...prevStats,
            userDonations: parseFloat(newUserTotalAdRevenue.toFixed(2)), // Update user donation display
            totalFunds: parseFloat((prevStats.totalFunds + revenue).toFixed(2)), // Ensure 2 decimal places
        }));

        setLoading(true); // Start loading indicator for Firestore logging
        try {
            // Log ad view and estimated revenue to '/adStats'
            await addDoc(collection(db, 'adStats'), {
                timestamp: serverTimestamp(),
                estimatedRevenue: revenue,
                method: 'ad_watch'
            });

            // Log to '/donations' collection for general record keeping
             await addDoc(collection(db, 'donations'), {
                method: 'ad_watch',
                amount: revenue,
                status: 'confirmed',
                public: false, // Ad donations are not public messages
                timestamp: serverTimestamp(),
                donorName: 'System (Ad Watch)', // Identify ad donations
            });

            toast({
                title: "Ad Viewed!",
                description: `You helped raise an estimated $${revenue.toFixed(4)}. Thank you!`,
                variant: 'default',
            });

        } catch (error) {
            console.error("Error logging ad stat: ", error);
            toast({
                title: "Logging Error",
                description: "Could not record ad view. Revenue may not be tracked.",
                variant: "destructive",
            });
        } finally {
             setLoading(false); // Stop loading indicator
        }
    }, [adWatchedCount, setLoading, toast, estimatedRevenueThisSession, userAdDonationsTotal]); // Include dependencies

     // --- Ad Watching Simulation Effect ---
     useEffect(() => {
        let timerInterval: NodeJS.Timeout | null = null;
        let countdownTimeout: NodeJS.Timeout | null = null;

        if (isAdModalOpen && currentAdLink) {
            setIsWatchingAd(true); // Mark as watching
            setLastAdRevenue(0); // Reset last revenue display

            const timerDuration = 20; // 20 seconds
            setAdTimer(timerDuration); // Start countdown display

            // Start countdown interval
            timerInterval = setInterval(() => {
                setAdTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
            }, 1000);

            // Simulate revenue calculation (as Adsterra doesn't provide direct JS callback)
            const generatedRevenue = parseFloat((Math.random() * (0.008 - 0.003) + 0.003).toFixed(4)); // $0.003 - $0.008

            // Set timeout to close modal and call handler
            countdownTimeout = setTimeout(() => {
                if (timerInterval) clearInterval(timerInterval); // Clear interval if timeout completes
                console.log('Ad timer finished.');
                handleAdWatched(generatedRevenue); // Call handler with simulated revenue
            }, timerDuration * 1000);
        }

        // Cleanup function
        return () => {
            if (timerInterval) clearInterval(timerInterval);
            if (countdownTimeout) clearTimeout(countdownTimeout);
             if (isWatchingAd) {
                 setIsWatchingAd(false);
                 setAdTimer(null);
             }
        };
     // eslint-disable-next-line react-hooks/exhaustive-deps -- handleAdWatched is memoized, isAdModalOpen/currentAdLink are triggers
     }, [isAdModalOpen, currentAdLink]); // Depend on modal open state and currentAdLink


    const watchAd = () => {
        if (isWatchingAd) return; // Prevent multiple instances if already watching

        // Select a random ad link
        const randomIndex = Math.floor(Math.random() * adLinks.length);
        const selectedAdLink = adLinks[randomIndex];
        setCurrentAdLink(selectedAdLink);
        setAdIframeKey(prev => prev + 1); // Change key to force iframe reload

        setIsAdModalOpen(true); // Open the ad modal
    };

    const cancelAdWatch = () => {
        setIsAdModalOpen(false); // Close the modal
        // Cleanup handled by useEffect return function
         toast({ title: "Ad Watch Cancelled", variant: "default" });
    };


    // --- Utility Functions ---
    const copyToClipboard = (text: string, type: string) => {
         if (typeof window !== 'undefined' && navigator.clipboard) {
             navigator.clipboard.writeText(text).then(() => {
                 toast({ title: `${type} Copied!`, description: text });
             }).catch(err => {
                 console.error('Failed to copy: ', err);
                 toast({ title: "Copy Failed", description: "Could not copy.", variant: "destructive" });
             });
         } else {
             toast({ title: "Copy Failed", description: "Clipboard not available.", variant: "destructive" });
         }
    };

    // --- Bank Donation Submission ---
    const handleBankDonationSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsSubmittingDonation(true);
        setLoading(true);
        const donationAmount = 0; // Bank amount is not tracked directly here
        try {
            await addDoc(collection(db, 'donations'), {
                method: 'bank',
                amount: donationAmount, // Store 0 or null as amount is unknown
                message: donationMessage || 'Bank transfer confirmed by user.',
                status: 'pending', // Assume pending until manually verified if needed
                public: false, // User confirmation is private
                timestamp: serverTimestamp(),
                donorName: 'Anonymous (Bank)', // Indicate source
            });
            toast({ title: "Donation Logged", description: "Thank you for confirming your bank transfer!" });
            setDonationMessage('');
            // Don't update userDonations stat for bank transfers here, as amount is unknown
            // Total Raised could be updated manually or via backend if bank logs are reconciled
            return true;
        } catch (error) {
            console.error("Error logging bank donation: ", error);
            toast({ title: "Logging Failed", description: "Could not log confirmation.", variant: "destructive" });
            return false;
        } finally {
            setIsSubmittingDonation(false);
            setLoading(false);
        }
    };

    // --- Crypto Donation Submission ---
    const handleCryptoDonationSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsSubmittingDonation(true);
        setLoading(true);
         const donationAmount = 0; // Crypto amount is not tracked directly here
        try {
            await addDoc(collection(db, 'donations'), {
                method: 'crypto',
                amount: donationAmount, // Store 0 or null as amount is unknown
                message: donationMessage || 'Crypto donation confirmed by user.',
                status: 'confirmed', // Assume confirmed
                public: false, // User confirmation is private
                timestamp: serverTimestamp(),
                donorName: 'Anonymous (Crypto)', // Indicate source
            });
            toast({ title: "Donation Logged", description: "Thank you for confirming your crypto donation!" });
            setDonationMessage('');
             // Don't update userDonations stat for crypto transfers here
             // Total Raised could be updated manually or via backend
            return true;
        } catch (error) {
            console.error("Error logging crypto donation: ", error);
            toast({ title: "Logging Failed", description: "Could not log confirmation.", variant: "destructive" });
            return false;
        } finally {
            setIsSubmittingDonation(false);
            setLoading(false);
        }
    };


    // --- Modals State ---
    const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);

    // Handlers to close modals on successful submission
    const handleSuccessfulBankSubmit = async () => {
        const success = await handleBankDonationSubmit();
        if (success) setIsBankModalOpen(false);
    };

    const handleSuccessfulCryptoSubmit = async () => {
        const success = await handleCryptoDonationSubmit();
        if (success) setIsCryptoModalOpen(false);
    };

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


    return (
        <div className="space-y-6">
             {/* App Logo */}
             <div className="text-center mt-2 mb-0 flex justify-center">
                <Image
                  src="/logo.svg"
                  alt="Falastini Logo"
                  width={150} // Adjust width as needed
                  height={50} // Adjust height as needed
                  priority // Load logo faster
                />
             </div>
             <Separator className="my-3 bg-border" /> {/* Added Separator */}

            {/* Daily Quote Section */}
            <DailyQuote />

            {/* Horizontal Stats Panel */}
            <section>
                 <h2 className="text-sm font-semibold text-muted-foreground mb-2 ml-1">Your Impact & Community Support:</h2>
                <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
                    {/* Stat Card 1: Your Donations */}
                    <Card className="flex-shrink-0 w-[31%] text-center bg-card border border-primary p-3"> {/* Green Border */}
                        <CardHeader className="p-1">
                            <CardTitle className="text-xs font-bold flex flex-col items-center text-primary"> {/* Green Text */}
                                <DollarSign className="h-4 w-4 mb-1" />
                                Your Donations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-1 pt-0">
                            0$ {/* Updated based on user request */}
                             <p className="text-[10px] text-muted-foreground opacity-80">(Ads Watched)</p> {/* Clarify source */}
                        </CardContent>
                    </Card>
                    {/* Stat Card 2: Total Raised */}
                    <Card className="flex-shrink-0 w-[31%] text-center bg-card border border-border p-3"> {/* White Border */}
                         <CardHeader className="p-1">
                            <CardTitle className="text-xs font-bold flex flex-col items-center">
                                <Banknote className="h-4 w-4 text-foreground mb-1" /> {/* White Icon */}
                                Total Raised
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-1 pt-0">
                            ${stats.totalFunds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </CardContent>
                    </Card>
                    {/* Stat Card 3: Total Donors */}
                    <Card className="flex-shrink-0 w-[31%] text-center bg-card border border-accent p-3"> {/* Red Border */}
                        <CardHeader className="p-1">
                            <CardTitle className="text-xs font-bold flex flex-col items-center text-accent"> {/* Red Text */}
                                <Users className="h-4 w-4 mb-1" />
                                Total Donors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-1 pt-0">
                            {stats.totalDonors.toLocaleString()}
                            <p className="text-[10px] text-muted-foreground opacity-80">supporters</p>
                        </CardContent>
                    </Card>
                </div>
            </section>


            {/* Middle Section: Donation Methods */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Card 1: Watch Ads to Donate */}
                 <Card className="bg-card border-none">
                     <CardHeader className="p-4 pb-2">
                         <CardTitle className="text-lg font-bold flex items-center"><Eye className="mr-2 h-5 w-5 text-primary" /> Watch Ads to Donate</CardTitle>
                         <CardDescription className="text-sm">Each view contributes directly.</CardDescription>
                     </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3 text-center">
                         {/* Trigger Ad Modal */}
                        <Dialog open={isAdModalOpen} onOpenChange={setIsAdModalOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={watchAd} variant="default" size="lg" className="btn-hover-glow-green mb-3 rounded-none w-full sm:w-auto" disabled={isWatchingAd}>
                                    {isWatchingAd ? <Loader2 className="mr-2 animate-spin" /> : <PlayCircle className="mr-2" />}
                                    {isWatchingAd ? 'Loading Ad...' : 'Watch Ad Now'}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px] bg-background border border-border min-h-[300px] flex flex-col justify-between p-0"> {/* Removed padding */}
                                <DialogHeader className="p-4 border-b border-border"> {/* Added padding and border */}
                                    <DialogTitle className="text-xl flex items-center"><Eye className="mr-2 h-6 w-6 text-primary" /> Watching Ad</DialogTitle>
                                    <DialogDescription>Please wait while the ad loads. This directly supports the cause.</DialogDescription>
                                </DialogHeader>
                                {/* Ad Content Area (Iframe for external link) */}
                                <div className="flex-1 flex flex-col items-center justify-center my-0 bg-muted/10 border-y border-dashed border-border min-h-[250px] relative"> {/* Use flex-col */}
                                    {adTimer !== null && adTimer > 0 && (
                                         <div className="absolute top-2 right-2 z-10 bg-background/70 px-2 py-1 rounded-full text-xs font-bold text-primary border border-primary">
                                            <Timer className="inline h-3 w-3 mr-1"/> {adTimer}s
                                         </div>
                                     )}
                                     {currentAdLink ? (
                                         <iframe
                                              key={adIframeKey} // Force reload on key change
                                              src={currentAdLink}
                                              className="w-full h-full border-0"
                                              sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Security sandbox attributes
                                              onError={() => toast({title: "Ad Load Error", description: "Could not load the ad content.", variant: "destructive"})}
                                          />
                                     ) : (
                                        <div className="flex flex-col items-center justify-center text-center h-full">
                                            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                            <p className="text-lg font-semibold text-primary">Loading Ad...</p>
                                            <p className="text-xs text-muted-foreground mt-1">Please wait</p>
                                        </div>
                                     )}
                                </div>
                                <DialogFooter className="p-4 border-t border-border gap-2 sm:gap-0"> {/* Added padding and border */}
                                    <Button type="button" variant="outline" onClick={cancelAdWatch} className="rounded-none btn-hover-border-accent" disabled={adTimer !== null && adTimer <= 0}>
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                         {/* Display Stats Below Button */}
                         {lastAdRevenue > 0 && (
                              <p className="text-sm font-semibold text-primary mt-2 animate-count-up">
                                  You just helped raise ~${lastAdRevenue.toFixed(4)}!
                              </p>
                          )}
                         <p className="text-xs text-muted-foreground mt-1">
                             Total ads watched this session: {adWatchedCount} (~${estimatedRevenueThisSession.toFixed(4)})
                         </p>

                         {/* Refresh button becomes "Watch Another" */}
                          <Button onClick={watchAd} variant="outline" size="sm" className="mt-2 btn-hover-border-primary rounded-none" disabled={isWatchingAd}>
                             <RefreshCw className="mr-2 h-4 w-4" /> Watch Another Ad
                         </Button>
                     </CardContent>
                </Card>

                {/* Card 2: Donate Now (Triggers Modals) */}
                <Card className="bg-card border-none">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg font-bold flex items-center"><HeartHandshake className="mr-2 h-5 w-5 text-primary"/> Donate Directly</CardTitle>
                        <CardDescription className="text-sm">Choose your preferred method.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex flex-col gap-3">
                        {/* Crypto Modal Trigger */}
                        <Dialog open={isCryptoModalOpen} onOpenChange={setIsCryptoModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-center border border-primary text-primary btn-hover-glow-green">
                                    <CreditCard className="mr-2 h-5 w-5" /> Donate via Crypto
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px] bg-background border border-border">
                                <DialogHeader>
                                    <DialogTitle className="text-xl flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary" /> Donate with Crypto</DialogTitle>
                                    <DialogDescription>Send BTC, ETH, or USDT (TRC20) to the addresses below.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                                    {cryptoWallets.map((wallet) => (
                                        <div key={wallet.name} className="border border-border p-3 space-y-2 bg-card">
                                            <Label className="font-semibold text-sm">{wallet.name}</Label>
                                            <div className="flex items-center gap-2">
                                                <Input readOnly value={wallet.address} className="flex-1 text-xs bg-muted border-muted" />
                                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(wallet.address, wallet.name)} className="h-8 w-8 btn-hover-glow-green">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                {/* Removed QR code button and dialog */}
                                            </div>
                                        </div>
                                    ))}
                                     <div className="border border-border p-3 space-y-2 bg-card">
                                         <Label className="font-semibold text-sm">Binance UID (for transfers within Binance)</Label>
                                         <div className="flex items-center gap-2">
                                             <Input readOnly value={bankDetails.binanceUID} className="flex-1 text-xs bg-muted border-muted" />
                                             <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.binanceUID, 'Binance UID')} className="h-8 w-8 btn-hover-glow-green">
                                                 <Copy className="h-4 w-4" />
                                             </Button>
                                         </div>
                                     </div>
                                    <Textarea
                                        id="crypto-message"
                                        value={donationMessage}
                                        onChange={(e) => setDonationMessage(e.target.value)}
                                        placeholder="Optional: Leave a short private message..."
                                        rows={2}
                                        className="mt-4 rounded-none bg-card border border-border"
                                    />
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" className="rounded-none btn-hover-border-accent">Cancel</Button>
                                    </DialogClose>
                                    <Button type="button" onClick={handleSuccessfulCryptoSubmit} disabled={isSubmittingDonation} className="rounded-none btn-hover-glow-green">
                                         {isSubmittingDonation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                         {isSubmittingDonation ? 'Logging...' : "I've Donated"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Bank Transfer Modal Trigger */}
                        <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-center border border-primary text-primary btn-hover-glow-green">
                                    <Banknote className="mr-2 h-5 w-5" /> Donate via Bank Transfer
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px] bg-background border border-border">
                                <DialogHeader>
                                    <DialogTitle className="text-xl flex items-center"><Banknote className="mr-2 h-6 w-6 text-primary" /> Bank Transfer Details</DialogTitle>
                                     <DialogDescription>Transfer funds directly using the details below. No proof upload needed.</DialogDescription> {/* Updated Description */}
                                </DialogHeader>
                                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                    <div className="border border-border p-3 space-y-2 bg-card">
                                        <p><strong>Bank:</strong> {bankDetails.bankName}</p>
                                        <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
                                        <div className="flex items-center gap-1">
                                            <strong>Account #:</strong> <span className="text-sm break-all">{bankDetails.accountNumber}</span>
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account Number')} className="h-6 w-6 btn-hover-glow-green"><Copy className="h-3 w-3" /></Button>
                                        </div>
                                         <div className="flex items-center gap-1">
                                            <strong>IBAN:</strong> <span className="text-sm break-all">{bankDetails.iban}</span>
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(bankDetails.iban, 'IBAN')} className="h-6 w-6 btn-hover-glow-green"><Copy className="h-3 w-3" /></Button>
                                         </div>
                                         {/* Removed Swift display based on prompt (assuming N/A) */}
                                         {/* {bankDetails.swift !== 'N/A' && ( ... )} */}
                                     </div>
                                     {/* Removed Proof Upload Section */}
                                    <Textarea
                                        id="bank-message"
                                        value={donationMessage}
                                        onChange={(e) => setDonationMessage(e.target.value)}
                                        placeholder="Optional: Leave a short private message..."
                                        rows={2}
                                        className="mt-4 rounded-none bg-card border border-border"
                                    />
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <DialogClose asChild>
                                       <Button type="button" variant="outline" className="rounded-none btn-hover-border-accent">Cancel</Button>
                                    </DialogClose>
                                    <Button type="button" onClick={handleSuccessfulBankSubmit} disabled={isSubmittingDonation} className="rounded-none btn-hover-glow-green">
                                        {isSubmittingDonation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                        {isSubmittingDonation ? 'Logging...' : "I've Donated"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </CardContent>
                </Card>
            </section>

            {/* Donate with Friends Card */}
            <section>
                <Card className="bg-card border-none">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg font-bold flex items-center"><UsersRound className="mr-2 h-5 w-5 text-primary"/> Donate with Friends</CardTitle>
                        <CardDescription className="text-sm">Share this app to amplify our impact.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 text-center">
                        <Button onClick={handleShare} size="lg" className="w-full sm:w-auto btn-hover-glow-green rounded-none border border-primary" variant="default" disabled={isSharing}>
                           {isSharing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Share2 className="mr-2 h-5 w-5" />}
                           {isSharing ? 'Sharing...' : 'Share the App'}
                        </Button>
                    </CardContent>
                </Card>
            </section>

            {/* CSS for hiding scrollbar */}
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

        </div>
    );
}


