// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
let analytics;

// Initialize Analytics only if supported (runs in browser)
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
            console.log("Firebase Analytics initialized");
        } else {
             console.log("Firebase Analytics not supported in this environment.");
        }
    });
}


export { app, db, storage, analytics };

// Firebase Rules Placeholder (Update in Firebase Console)
/*
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Donations: Public read for records page, anyone can write confirmation
    match /donations/{donationId} {
      allow read: if true; // Needed for Records page transparency
      allow write: if true; // Allow users to confirm their donation (crypto/bank/ad_watch)
      // Add validation: ensure 'method', 'timestamp' exist, 'status' is valid etc.
      // allow write: if request.resource.data.method is string && request.resource.data.timestamp == request.time;
    }

    // Quotes: Public read-only access
    match /quotes/{quoteId} {
      allow read: if true;
      allow write: if false; // Managed manually or via secure backend
    }

    // Ad Stats: No public read, anyone can write (client-side logging)
    match /adStats/{statId} {
      allow read: if false; // Protect detailed stats
      allow write: if true; // Allow client-side logging of ad views/revenue
      // Add validation: ensure 'timestamp', 'estimatedRevenue' exist
      // allow write: if request.resource.data.timestamp == request.time && request.resource.data.estimatedRevenue is number;
    }

    // User Stats (Tracking user-specific donation totals)
    match /userStats/{userId} {
      allow read: if true; // Allow reading aggregated stats if needed
      allow write: if false; // Generally managed by backend/functions or secure rules based on auth
      // If allowing users to update their own stats (e.g., via functions):
      // allow write: if request.auth != null && request.auth.uid == userId;
    }
    // Optional: Nested collection for detailed user donations (if needed beyond main /donations)
    // match /userStats/{userId}/donations/{userDonationId} { ... }

    // Meta Stats (Aggregated totals - example for Total Raised/Donors)
    match /meta/stats {
       allow read: if true; // Public can read total funds/donors
       allow write: if false; // ONLY updated by secure backend/functions/triggers
    }

     // Supporters: (REMOVED based on prompt - no form)
     // If re-added: read: false, write: true

     // Stories: (REMOVED based on prompt) - Data moved to Records
     // If Stories feature is re-added: read: true, write: false

     // Alerts: (REMOVED based on prompt)
     // If re-added: read: true, write: false

  }
}

service firebase.storage {
  match /b/{bucket}/o {
     // Bank Proofs: (REMOVED based on prompt - no uploads)

     // Other paths (e.g., quote images) - adjust as needed
     match /{allPaths=**} {
       allow read: if true; // Default public read access for images etc.
       allow write: if false; // Default deny write access
     }
  }
}
*/
