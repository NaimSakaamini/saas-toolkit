/**
 * Authentication Service
 * 
 * Provides functions for user authentication, registration, and profile management.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  updateProfile as firebaseUpdateProfile,
  User,
  UserCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Firestore } from 'firebase/firestore';
import { FirebaseServices } from '../firebase/config';

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt?: Date;
  organizations?: {
    orgId: string;
    role: 'owner' | 'admin' | 'member' | 'guest';
    joinedAt: Date;
  }[];
  currentOrganization?: string;
}

export interface AuthError extends Error {
  code?: string;
}

/**
 * Sign in with email and password
 * 
 * @param services Firebase services
 * @param email User's email
 * @param password User's password
 * @returns User credential
 */
export const signInWithEmail = async (
  services: FirebaseServices,
  email: string, 
  password: string
): Promise<UserCredential> => {
  const { auth } = services;
  
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 * 
 * @param services Firebase services
 * @returns User credential
 */
export const signInWithGoogle = async (services: FirebaseServices): Promise<UserCredential> => {
  const { auth } = services;
  
  try {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign up with email and password
 * 
 * @param services Firebase services
 * @param email User's email
 * @param password User's password
 * @param displayName User's display name
 * @returns User credential
 */
export const signUp = async (
  services: FirebaseServices,
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  const { auth, db } = services;
  
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Update profile if display name is provided
    if (displayName && user) {
      await firebaseUpdateProfile(user, { displayName });
    }
    
    // Create user profile in Firestore
    await createUserProfile(services, user.uid, {
      email: user.email || email,
      displayName: displayName || user.displayName || email.split('@')[0],
      photoURL: user.photoURL || undefined,
      phoneNumber: user.phoneNumber || undefined,
    });
    
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * 
 * @param services Firebase services
 */
export const signOut = async (services: FirebaseServices): Promise<void> => {
  const { auth } = services;
  
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Reset password
 * 
 * @param services Firebase services
 * @param email User's email
 */
export const resetPassword = async (services: FirebaseServices, email: string): Promise<void> => {
  const { auth } = services;
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

/**
 * Update password
 * 
 * @param services Firebase services
 * @param currentPassword Current password
 * @param newPassword New password
 */
export const updatePassword = async (
  services: FirebaseServices,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const { auth } = services;
  const user = auth.currentUser;
  
  if (!user || !user.email) {
    throw new Error('No authenticated user found');
  }
  
  try {
    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await firebaseUpdatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Create user profile in Firestore
 * 
 * @param services Firebase services
 * @param userId User ID
 * @param userData User data
 */
export const createUserProfile = async (
  services: FirebaseServices,
  userId: string,
  userData: Partial<UserProfile>
): Promise<void> => {
  const { db } = services;
  
  try {
    const userRef = doc(db, 'users', userId);
    
    // Create user profile with timestamp
    await setDoc(userRef, {
      ...userData,
      uid: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 * 
 * @param services Firebase services
 * @param userId User ID
 * @returns User profile or null if not found
 */
export const getUserProfile = async (
  services: FirebaseServices,
  userId: string
): Promise<UserProfile | null> => {
  const { db } = services;
  
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile in Firestore
 * 
 * @param services Firebase services
 * @param userId User ID
 * @param userData User data to update
 */
export const updateUserProfile = async (
  services: FirebaseServices,
  userId: string,
  userData: Partial<UserProfile>
): Promise<void> => {
  const { db, auth } = services;
  const user = auth.currentUser;
  
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update user profile with timestamp
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date(),
    });
    
    // Update Firebase Auth profile if needed
    if (user && (userData.displayName || userData.photoURL)) {
      await firebaseUpdateProfile(user, {
        displayName: userData.displayName || user.displayName,
        photoURL: userData.photoURL || user.photoURL,
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 