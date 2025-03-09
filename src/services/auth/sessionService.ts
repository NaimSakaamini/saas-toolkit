/**
 * Session Management Service
 * 
 * Provides functions for managing user sessions.
 */

import { doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { FirebaseServices } from '../firebase/config';

// Types
export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress?: string;
  location?: string;
  lastActive: Date;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Generate a unique ID
 * 
 * Simple function to generate a unique ID without external dependencies
 */
const generateUniqueId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Create a new user session
 * 
 * @param services Firebase services
 * @param userId User ID
 * @returns Session ID
 */
export const createSession = async (services: FirebaseServices, userId: string): Promise<string> => {
  const { db } = services;
  
  try {
    // Generate a unique session ID
    const sessionId = generateUniqueId();
    
    // Create session document
    const sessionData: Omit<UserSession, 'id'> = {
      userId,
      deviceInfo: getDeviceInfo(),
      lastActive: new Date(),
      createdAt: new Date(),
    };
    
    // Add session to Firestore
    await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      id: sessionId,
    });
    
    // Store session ID in localStorage
    localStorage.setItem('sessionId', sessionId);
    
    return sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

/**
 * Get a session by ID
 * 
 * @param services Firebase services
 * @param sessionId Session ID
 * @returns Session or null if not found
 */
export const getSession = async (services: FirebaseServices, sessionId: string): Promise<UserSession | null> => {
  const { db } = services;
  
  try {
    // Query sessions collection for the session ID
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('id', '==', sessionId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const sessionDoc = querySnapshot.docs[0];
      const sessionData = sessionDoc.data() as UserSession;
      
      // Convert Firestore timestamps to Date objects
      return {
        ...sessionData,
        lastActive: sessionData.lastActive instanceof Timestamp 
          ? sessionData.lastActive.toDate() 
          : sessionData.lastActive,
        createdAt: sessionData.createdAt instanceof Timestamp 
          ? sessionData.createdAt.toDate() 
          : sessionData.createdAt,
        expiresAt: sessionData.expiresAt instanceof Timestamp 
          ? sessionData.expiresAt.toDate() 
          : sessionData.expiresAt,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

/**
 * Get all sessions for a user
 * 
 * @param services Firebase services
 * @param userId User ID
 * @returns Array of sessions
 */
export const getUserSessions = async (services: FirebaseServices, userId: string): Promise<UserSession[]> => {
  const { db } = services;
  
  try {
    // Query sessions collection for the user ID
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    // Map query results to UserSession objects
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as UserSession;
      
      // Convert Firestore timestamps to Date objects
      return {
        ...data,
        lastActive: data.lastActive instanceof Timestamp 
          ? data.lastActive.toDate() 
          : data.lastActive,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : data.createdAt,
        expiresAt: data.expiresAt instanceof Timestamp 
          ? data.expiresAt.toDate() 
          : data.expiresAt,
      };
    });
  } catch (error) {
    console.error('Error getting user sessions:', error);
    throw error;
  }
};

/**
 * Update session activity timestamp
 * 
 * @param services Firebase services
 * @param sessionId Session ID
 */
export const updateSessionActivity = async (services: FirebaseServices, sessionId: string): Promise<void> => {
  const { db } = services;
  
  try {
    // Query sessions collection for the session ID
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('id', '==', sessionId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const sessionDoc = querySnapshot.docs[0];
      await updateDoc(sessionDoc.ref, { lastActive: new Date() });
    }
  } catch (error) {
    console.error('Error updating session activity:', error);
    throw error;
  }
};

/**
 * Terminate a session
 * 
 * @param services Firebase services
 * @param sessionId Session ID
 */
export const terminateSession = async (services: FirebaseServices, sessionId: string): Promise<void> => {
  const { db } = services;
  
  try {
    // Query sessions collection for the session ID
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('id', '==', sessionId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const sessionDoc = querySnapshot.docs[0];
      await deleteDoc(sessionDoc.ref);
      
      // Clear session ID from localStorage if it matches the terminated session
      const currentSessionId = localStorage.getItem('sessionId');
      if (currentSessionId === sessionId) {
        localStorage.removeItem('sessionId');
      }
    }
  } catch (error) {
    console.error('Error terminating session:', error);
    throw error;
  }
};

/**
 * Validate the current session
 * 
 * @param services Firebase services
 * @returns True if session is valid, false otherwise
 */
export const validateSession = async (services: FirebaseServices): Promise<boolean> => {
  try {
    // Get session ID from localStorage
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      return false;
    }
    
    // Get session from Firestore
    const session = await getSession(services, sessionId);
    if (!session) {
      return false;
    }
    
    // Check if session has expired
    if (session.expiresAt && new Date() > session.expiresAt) {
      await terminateSession(services, sessionId);
      return false;
    }
    
    // Update session activity
    await updateSessionActivity(services, sessionId);
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
};

/**
 * Clear the current session
 * 
 * @param services Firebase services
 */
export const clearSession = async (services: FirebaseServices): Promise<void> => {
  try {
    // Get session ID from localStorage
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      // Terminate session in Firestore
      await terminateSession(services, sessionId);
    }
    
    // Clear session ID from localStorage
    localStorage.removeItem('sessionId');
  } catch (error) {
    console.error('Error clearing session:', error);
    throw error;
  }
};

/**
 * Get device information for session tracking
 * 
 * @returns Device information string
 */
const getDeviceInfo = (): string => {
  try {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return JSON.stringify({ userAgent, platform, timestamp: new Date().toISOString() });
  } catch (error) {
    return 'Unknown device';
  }
}; 