'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useFirebase } from '../firebase/FirebaseProvider';
import {
  signInWithEmail,
  signInWithGoogle,
  signUp,
  signOut,
  resetPassword,
  updatePassword,
  getUserProfile,
  updateUserProfile,
  UserProfile,
  AuthError
} from './authService';
import {
  createSession,
  validateSession,
  clearSession,
  getUserSessions,
  terminateSession,
  UserSession
} from './sessionService';

// Authentication context type
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  sessions: UserSession[];
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllOtherSessions: () => Promise<void>;
  clearError: () => void;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Authentication provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Provides authentication state and functions to all child components.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { services } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  
  // Clear error
  const clearError = () => setError(null);
  
  // Sign in with email and password
  const handleSignInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    clearError();
    
    try {
      await signInWithEmail(services, email, password);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };
  
  // Sign in with Google
  const handleSignInWithGoogle = async () => {
    setLoading(true);
    clearError();
    
    try {
      await signInWithGoogle(services);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };
  
  // Sign up with email and password
  const handleSignUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    clearError();
    
    try {
      await signUp(services, email, password, displayName);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };
  
  // Sign out
  const handleSignOut = async () => {
    setLoading(true);
    clearError();
    
    try {
      // Clear session
      await clearSession(services);
      
      // Sign out from Firebase
      await signOut(services);
      
      // Clear user state
      setUser(null);
      setUserProfile(null);
      setSessions([]);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err) {
      setError(err as AuthError);
      console.error('Error signing out:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const handleResetPassword = async (email: string) => {
    setLoading(true);
    clearError();
    
    try {
      await resetPassword(services, email);
      setLoading(false);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };
  
  // Update password
  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    clearError();
    
    try {
      await updatePassword(services, currentPassword, newPassword);
      setLoading(false);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };
  
  // Update user profile
  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    clearError();
    
    if (!user) {
      setError(new Error('No authenticated user') as AuthError);
      setLoading(false);
      return;
    }
    
    try {
      await updateUserProfile(services, user.uid, data);
      
      // Refresh user profile
      const updatedProfile = await getUserProfile(services, user.uid);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
      setLoading(false);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };
  
  // Terminate session
  const handleTerminateSession = async (sessionId: string) => {
    setLoading(true);
    clearError();
    
    try {
      await terminateSession(services, sessionId);
      
      // Update sessions list
      if (user) {
        const updatedSessions = await getUserSessions(services, user.uid);
        setSessions(updatedSessions);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };
  
  // Terminate all other sessions
  const handleTerminateAllOtherSessions = async () => {
    setLoading(true);
    clearError();
    
    try {
      // Get current session ID
      const currentSessionId = localStorage.getItem('sessionId');
      
      if (!currentSessionId || !user) {
        throw new Error('No active session or user');
      }
      
      // Get all user sessions
      const userSessions = await getUserSessions(services, user.uid);
      
      // Terminate all sessions except the current one
      const terminationPromises = userSessions
        .filter(session => session.id !== currentSessionId)
        .map(session => terminateSession(services, session.id));
      
      await Promise.all(terminationPromises);
      
      // Update sessions list
      const updatedSessions = await getUserSessions(services, user.uid);
      setSessions(updatedSessions);
      
      setLoading(false);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      throw err;
    }
  };
  
  // Load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(services, userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };
  
  // Load user sessions
  const loadUserSessions = async (userId: string) => {
    try {
      const userSessions = await getUserSessions(services, userId);
      setSessions(userSessions);
    } catch (error) {
      console.error('Error loading user sessions:', error);
    }
  };
  
  // Listen for auth state changes
  useEffect(() => {
    if (!services.auth) return;
    
    const unsubscribe = onAuthStateChanged(services.auth, async (authUser) => {
      setLoading(true);
      
      if (authUser) {
        setUser(authUser);
        
        // Load user profile
        await loadUserProfile(authUser.uid);
        
        // Load user sessions
        await loadUserSessions(authUser.uid);
        
        // Validate session or create a new one
        const isSessionValid = await validateSession(services);
        if (!isSessionValid) {
          await createSession(services, authUser.uid);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setSessions([]);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [services.auth]);
  
  // Context value
  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    sessions,
    signInWithEmail: handleSignInWithEmail,
    signInWithGoogle: handleSignInWithGoogle,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    updateProfile: handleUpdateProfile,
    terminateSession: handleTerminateSession,
    terminateAllOtherSessions: handleTerminateAllOtherSessions,
    clearError,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Use Auth Hook
 * 
 * Custom hook to access the authentication context.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 