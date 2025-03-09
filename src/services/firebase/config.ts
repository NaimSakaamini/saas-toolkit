/**
 * Firebase Configuration Service
 * 
 * This service provides a flexible way to initialize Firebase, either by:
 * 1. Providing a Firebase configuration object
 * 2. Providing pre-initialized Firebase instances
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

/**
 * Initialize Firebase services with flexible options
 * 
 * @param config Optional Firebase configuration object
 * @param app Optional pre-initialized Firebase app
 * @param auth Optional pre-initialized Firebase auth
 * @param db Optional pre-initialized Firestore instance
 * @returns Object containing Firebase app, auth, and db instances
 */
export function initializeFirebase(
  config?: FirebaseConfig,
  app?: FirebaseApp,
  auth?: Auth,
  db?: Firestore
): FirebaseServices {
  // Use provided app or initialize a new one
  const firebaseApp = app || (getApps().length > 0 
    ? getApp() 
    : config 
      ? initializeApp(config) 
      : (() => { 
          console.warn('No Firebase config provided, using default config from environment variables');
          const envConfig = getFirebaseConfigFromEnv();
          if (envConfig) {
            return initializeApp(envConfig);
          }
          throw new Error('Firebase app initialization failed: No config or app instance provided');
        })()
  );
  
  // Use provided auth or initialize a new one
  const firebaseAuth = auth || getAuth(firebaseApp);
  
  // Use provided db or initialize a new one
  const firebaseDb = db || getFirestore(firebaseApp);
  
  return {
    app: firebaseApp,
    auth: firebaseAuth,
    db: firebaseDb,
  };
}

/**
 * Get Firebase configuration from environment variables
 * 
 * @returns Firebase configuration object or null if environment variables are not set
 */
export function getFirebaseConfigFromEnv(): FirebaseConfig | null {
  if (
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    !process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    !process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  ) {
    return null;
  }
  
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
}

// Singleton instance for use throughout the app
let firebaseServices: FirebaseServices | null = null;

/**
 * Get or initialize Firebase services
 * 
 * @param config Optional Firebase configuration object
 * @param app Optional pre-initialized Firebase app
 * @param auth Optional pre-initialized Firebase auth
 * @param db Optional pre-initialized Firestore instance
 * @returns Object containing Firebase app, auth, and db instances
 */
export function getFirebaseServices(
  config?: FirebaseConfig,
  app?: FirebaseApp,
  auth?: Auth,
  db?: Firestore
): FirebaseServices {
  if (!firebaseServices) {
    // Try to get config from environment if not provided
    const envConfig = !config ? getFirebaseConfigFromEnv() : null;
    
    firebaseServices = initializeFirebase(config || envConfig || undefined, app, auth, db);
  }
  
  return firebaseServices;
}

/**
 * Reset Firebase services (useful for testing)
 */
export function resetFirebaseServices(): void {
  firebaseServices = null;
} 