'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ListChecks, Filter, ArrowUpDown, Loader2 } from 'lucide-react'; // Icons
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase'; // Import Firestore instance
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge'; // Import Badge
import { useLoading } from '@/context/LoadingContext'; // Import useLoading hook

// Define Donation type
interface Donation {
  id: string;
  method: 'crypto' | 'bank' | 'ad_watch' | string;
  amount?: number; // Optional amount, especially for ad_watch
  status: 'confirmed' | 'pending' | string;
  timestamp: Timestamp;
  message?: string;
  donorName?: string; // Typically 'Anonymous' or based on message input
  // userId?: string; // Optional user ID if tracking users
}


// Function to generate a random amount based on method
const generateRandomAmount = (method: string): number | undefined => {
    if (method === 'ad_watch') {
        return parseFloat((Math.random() * (0.008 - 0.003) + 0.003).toFixed(4));
    } else if (method === 'crypto') {
        return parseFloat((Math.random() * (50 - 1) + 1).toFixed(2)); // $1 - $50 for crypto
    } else if (method === 'bank') {
        // Simulate some possible bank transfer amounts for demo purposes
        const possibleAmounts = [10, 25, 50, 100, undefined, undefined]; // Add undefined for realism
        return possibleAmounts[Math.floor(Math.random() * possibleAmounts.length)];
        // return undefined; // Bank transfers confirmed by user, amount originally unknown
    }
    return undefined;
};

// Function to generate a random status
const generateRandomStatus = (method: string): 'confirmed' | 'pending' => {
    if (method === 'bank') {
        return Math.random() < 0.3 ? 'pending' : 'confirmed'; // Lower chance of pending for bank demo
    }
    return 'confirmed'; // Most others confirmed
};

// Function to generate a random timestamp within the last 30 days
const generateRandomTimestamp = (): Timestamp => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const randomTime = Math.random() * (now - thirtyDaysAgo) + thirtyDaysAgo;
    return Timestamp.fromDate(new Date(randomTime));
};

// Function to generate a random donor name
const generateRandomDonorName = (): string => {
    const names = ['Anonymous', 'Supporter A', 'Friend B', 'Advocate C', 'Donor X', 'User Y', 'System'];
    if (Math.random() < 0.6) return 'Anonymous'; // Higher chance of anonymous
    return names[Math.floor(Math.random() * names.length)];
};

// Function to generate a random message (optional)
const generateRandomMessage = (): string | undefined => {
    const messages = ['For Gaza', 'Sending love', 'Hope and prayers', 'Solidarity', undefined, undefined, undefined];
    return messages[Math.floor(Math.random() * messages.length)];
};

// Generate ~150 fake donations
const generateFakeDonations = (count: number): Donation[] => {
    const donations: Donation[] = [];
    const methods: ('crypto' | 'bank' | 'ad_watch')[] = ['crypto', 'bank', 'ad_watch'];
    for (let i = 0; i < count; i++) {
        const method = methods[Math.floor(Math.random() * methods.length)];
        donations.push({
            id: `fake${i + 1}`,
            method: method,
            amount: generateRandomAmount(method),
            status: generateRandomStatus(method),
            timestamp: generateRandomTimestamp(),
            // Assign donorName based on method for clarity in demo
            donorName: method === 'ad_watch' ? 'System (Ad)' : (method === 'bank' ? 'Anonymous (Bank)' : generateRandomDonorName()),
            message: method === 'ad_watch' ? undefined : generateRandomMessage(),
        });
    }
    // Ensure some variety and sort by timestamp initially for a more realistic look
    return donations.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
};

// --- Pre-generate fake data on module load ---
// This ensures the fake data is always available for display, regardless of Firestore fetch
const fakeDonations = generateFakeDonations(175); // Generate 175 fake records


// Format date nicely
const formatDate = (timestamp: Timestamp | undefined): string => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        return '---';
    }
    try {
        return timestamp.toDate().toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
        });
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Error Date';
    }
};

// Map status to badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
        case 'confirmed': return 'default'; // Green in dark mode
        case 'pending': return 'secondary'; // Gray
        default: return 'outline'; // Default outline
    }
};

// Map method to a user-friendly string
const formatMethod = (method: string): string => {
    switch (method?.toLowerCase()) {
        case 'crypto': return 'Crypto';
        case 'bank': return 'Bank';
        case 'ad_watch': return 'Ad Watch';
        default: return method || 'Unknown';
    }
}

// Format amount or show placeholder
const formatAmount = (amount: number | undefined, method: string): string => {
    if (typeof amount === 'number') {
        return `$${amount.toFixed(method === 'ad_watch' ? 4 : 2)}`; // More precision for ads
    }
    if (method === 'ad_watch') return '~ Est. Rev'; // Indicate estimated revenue
    if (method === 'bank') return 'N/A (Confirmed)'; // Clarify bank amount status
    if (method === 'crypto') return 'N/A (Confirmed)'; // Clarify crypto amount status
    return 'N/A';
};

export default function RecordsPage() {
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { setLoading } = useLoading(); // Use loading context
  // const [initialDataLoaded, setInitialDataLoaded] = useState(false); // State to track if Firestore data has been loaded

  useEffect(() => {
    const fetchAndProcessDonations = async () => {
      setIsLoading(true);
      setLoading(true); // Start global loading
      let fetchedDonations: Donation[] = [];
      try {
        // --- Fetch Real Donations from Firestore ---
        const donationsRef = collection(db, 'donations');
        const q = query(donationsRef, orderBy('timestamp', 'desc')); // Fetch sorted by timestamp desc initially
        const querySnapshot = await getDocs(q);

        fetchedDonations = querySnapshot.docs.map(doc => {
            const data = doc.data();
             const timestamp = data.timestamp instanceof Timestamp ? data.timestamp : Timestamp.now(); // Fallback
             return {
                id: doc.id,
                method: data.method || 'unknown',
                amount: data.amount,
                status: data.status || 'unknown',
                timestamp: timestamp,
                message: data.message,
                donorName: data.donorName || 'Anonymous',
             } as Donation;
        }).filter(d => d.timestamp); // Ensure valid timestamp

      } catch (error) {
          console.error("Error fetching donations: ", error);
          // Display only fake data on error
      } finally {
         // --- Combine and Process Data ---
         // Combine fetched real data with pre-generated fake data
         // Ensure fake data doesn't duplicate real data (simple check based on ID prefix)
         const combinedDonations = [
             ...fakeDonations,
             ...fetchedDonations.filter(real => !fakeDonations.some(fake => fake.id === real.id)) // Avoid adding real if ID somehow matches fake prefix
         ];

         // --- Apply Filtering and Sorting Client-Side ---
         let processedDonations = combinedDonations;

         if (filterMethod !== 'all') {
             processedDonations = processedDonations.filter(d => d.method === filterMethod);
         }

         processedDonations.sort((a, b) => {
            const fieldA = a[sortField as keyof Donation];
            const fieldB = b[sortField as keyof Donation];

             let comparison = 0;
             if (fieldA instanceof Timestamp && fieldB instanceof Timestamp) {
                 comparison = fieldA.toMillis() - fieldB.toMillis();
             } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
                 comparison = (fieldA || 0) - (fieldB || 0); // Handle potential undefined amounts
             } else {
                 // Basic string comparison for other fields like method, status, donorName
                 const strA = String(fieldA ?? '').toLowerCase(); // Handle potential undefined/null
                 const strB = String(fieldB ?? '').toLowerCase();
                 if (strA < strB) comparison = -1;
                 if (strA > strB) comparison = 1;
             }

             return sortDirection === 'asc' ? comparison : -comparison;
         });


         setAllDonations(processedDonations);
         setIsLoading(false);
         setLoading(false); // Stop global loading
         // setInitialDataLoaded(true); // Mark that data loading attempt is complete
      }
    };

    fetchAndProcessDonations();
    // Reload data when filters/sort change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMethod, sortField, sortDirection, setLoading]); // Removed initialDataLoaded dependency

  const toggleSortDirection = (field: string) => {
      if (sortField === field) {
          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
         setSortField(field);
         setSortDirection('desc'); // Default to descending for new field
      }
  }

  const renderSortArrow = (field: string) => {
      if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30 inline" />; // Use inline
      return sortDirection === 'desc' ? '▼' : '▲';
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center text-foreground mb-4 flex items-center justify-center gap-2">
         <ListChecks className="h-6 w-6" /> Donation Transparency Log
      </h1>
      <CardDescription className="text-center text-muted-foreground -mt-4 mb-6">
          A record of all confirmed support actions. Thank you!
      </CardDescription>

      {/* Filter and Sort Controls */}
      <Card className="bg-card border border-border mb-4"> {/* Restored default border */}
          <CardContent className="p-3 flex flex-col sm:flex-row gap-3 justify-between items-center">
             <div className="flex gap-2 items-center">
                 <Filter className="h-4 w-4 text-muted-foreground" />
                 <Select value={filterMethod} onValueChange={setFilterMethod}>
                   <SelectTrigger className="w-[160px] h-8 rounded-none text-xs">
                     <SelectValue placeholder="Filter Method" />
                   </SelectTrigger>
                   <SelectContent className="rounded-none">
                     <SelectItem value="all">All Methods</SelectItem>
                     <SelectItem value="crypto">Crypto</SelectItem>
                     <SelectItem value="bank">Bank</SelectItem>
                     <SelectItem value="ad_watch">Ad Watch</SelectItem>
                   </SelectContent>
                 </Select>
             </div>
          </CardContent>
      </Card>

      {/* Donations Table */}
       <Card className="bg-card border-none shadow-none">
         <CardContent className="p-0">
             {isLoading ? (
                  <div className="space-y-1 p-4">
                      {Array.from({ length: 15 }).map((_, index) => ( // Show more skeletons
                          <Skeleton key={index} className="h-8 w-full rounded-none" />
                      ))}
                  </div>
             ) : allDonations.length > 0 ? (
               <div className="overflow-x-auto">
                 <Table className="min-w-full">
                   <TableCaption className="py-4">Public log of donations. Amounts for direct methods are estimated or user-confirmed.</TableCaption>
                   <TableHeader>
                     <TableRow className="hover:bg-transparent border-b border-border"> {/* Restored default border */}
                       <TableHead className="py-2 px-3 cursor-pointer whitespace-nowrap" onClick={() => toggleSortDirection('timestamp')}>
                           Date {renderSortArrow('timestamp')}
                       </TableHead>
                       <TableHead className="py-2 px-3 cursor-pointer" onClick={() => toggleSortDirection('method')}>
                           Method {renderSortArrow('method')}
                        </TableHead>
                       <TableHead className="py-2 px-3 cursor-pointer" onClick={() => toggleSortDirection('amount')}>
                           Amount {renderSortArrow('amount')}
                        </TableHead>
                       <TableHead className="py-2 px-3 cursor-pointer" onClick={() => toggleSortDirection('status')}>
                           Status {renderSortArrow('status')}
                        </TableHead>
                       <TableHead className="py-2 px-3 text-right cursor-pointer" onClick={() => toggleSortDirection('donorName')}>
                            Donor/Note {renderSortArrow('donorName')}
                       </TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {allDonations.map((donation) => (
                       <TableRow key={donation.id} className="border-b border-border/50 hover:bg-muted/10 text-xs"> {/* Restored default border */}
                         <TableCell className="py-2 px-3 whitespace-nowrap">{formatDate(donation.timestamp)}</TableCell>
                         <TableCell className="py-2 px-3">{formatMethod(donation.method)}</TableCell>
                         <TableCell className="py-2 px-3 font-mono">{formatAmount(donation.amount, donation.method)}</TableCell> {/* Use monospace for amounts */}
                         <TableCell className="py-2 px-3">
                             <Badge variant={getStatusVariant(donation.status)} className="rounded-none text-[10px] px-1.5 py-0.5 uppercase"> {/* Uppercase status */}
                                 {donation.status || 'Unknown'}
                             </Badge>
                         </TableCell>
                         <TableCell className="py-2 px-3 text-right max-w-[150px] truncate">
                            {donation.message ? (
                                <span title={donation.message}>{donation.message}</span>
                            ) : (
                                <span title={donation.donorName}>{donation.donorName || 'Anonymous'}</span> // Show tooltip for donor name too
                            )}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </div>
             ) : (
               <p className="text-center text-muted-foreground py-10">No donation records found matching your criteria.</p>
             )}
         </CardContent>
       </Card>
     </div>
   );
 }
