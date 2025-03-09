'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseConfig, FirebaseServices, getFirebaseServices } from './config';

// Default Firebase configuration


// Create Firebase context
interface FirebaseContextType {
  services: FirebaseServices;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

// Firebase provider props
interface FirebaseProviderProps {
  children: ReactNode;
  config?: FirebaseConfig;
  app?: FirebaseApp;
  auth?: Auth;
  db?: Firestore;
}

/**
 * Firebase Provider Component
 * 
 * Provides Firebase services to all child components through React Context.
 * Accepts either a Firebase config object or pre-initialized Firebase instances.
 */
export function FirebaseProvider({
  children,
  config = defaultFirebaseConfig,
  app,
  auth,
  db
}: FirebaseProviderProps) {
  // Initialize Firebase services
  const services = getFirebaseServices(config, app, auth, db);
  
  return (
    <FirebaseContext.Provider value={{ services }}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * Hook to use Firebase services
 * 
 * @returns Firebase context with services
 * @throws Error if used outside of FirebaseProvider
 */
export function useFirebase() {
  const context = useContext(FirebaseContext);
  
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  
  return context;
} 