'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirebase } from '@/services/firebase/FirebaseProvider';
import { useAuth } from '@/services/auth/AuthProvider';
import { useOrganization } from '@/services/organization/OrganizationProvider';
import { 
  Invitation,
  InvitationServiceCallbacks,
  createInvitation,
  getInvitation,
  getInvitationByToken,
  getInvitationsByEmail,
  getInvitationsByOrg,
  updateInvitationStatus,
  cancelInvitation,
  acceptInvitation,
  declineInvitation,
  resendInvitation
} from './invitationService';

interface InvitationContextType {
  invitations: Invitation[];
  loading: boolean;
  error: Error | null;
  createNewInvitation: (invitationData: Partial<Invitation>, callbacks?: InvitationServiceCallbacks) => Promise<string>;
  getInvitationDetails: (invitationId: string) => Promise<Invitation | null>;
  getInvitationByTokenString: (token: string) => Promise<Invitation | null>;
  getInvitationsForCurrentOrg: () => Promise<Invitation[]>;
  cancelInvitationById: (invitationId: string) => Promise<void>;
  acceptInvitationById: (invitationId: string, userId: string) => Promise<void>;
  declineInvitationById: (invitationId: string) => Promise<void>;
  resendInvitationById: (invitationId: string, callbacks?: InvitationServiceCallbacks) => Promise<Invitation>;
  refreshInvitations: () => Promise<void>;
  clearError: () => void;
}

const InvitationContext = createContext<InvitationContextType | null>(null);

interface InvitationProviderProps {
  children: ReactNode;
}

export function InvitationProvider({ children }: InvitationProviderProps) {
  const { services } = useFirebase();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const clearError = () => setError(null);
  
  // Load invitations when the current organization changes
  useEffect(() => {
    if (currentOrganization) {
      loadInvitations();
    } else {
      setInvitations([]);
    }
  }, [currentOrganization]);
  
  // Load invitations for the current organization
  const loadInvitations = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    clearError();
    
    try {
      const orgInvitations = await getInvitationsByOrg(services, currentOrganization.id);
      setInvitations(orgInvitations);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading invitations:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new invitation
  const createNewInvitation = async (
    invitationData: Partial<Invitation>,
    callbacks?: InvitationServiceCallbacks
  ): Promise<string> => {
    if (!user || !currentOrganization) {
      throw new Error('User or organization not found');
    }
    
    setLoading(true);
    clearError();
    
    try {
      // Add organization and inviter information if not provided
      if (!invitationData.orgId) {
        invitationData.orgId = currentOrganization.id;
      }
      
      if (!invitationData.orgName) {
        invitationData.orgName = currentOrganization.name;
      }
      
      if (!invitationData.invitedBy) {
        invitationData.invitedBy = user.uid;
      }
      
      if (!invitationData.inviterName) {
        invitationData.inviterName = user.displayName || user.email?.split('@')[0] || 'Unknown';
      }
      
      // Create the invitation
      const invitationId = await createInvitation(services, invitationData, callbacks);
      
      // Refresh invitations
      await loadInvitations();
      
      return invitationId;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating invitation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Get invitation details
  const getInvitationDetails = async (invitationId: string): Promise<Invitation | null> => {
    setLoading(true);
    clearError();
    
    try {
      return await getInvitation(services, invitationId);
    } catch (err) {
      setError(err as Error);
      console.error('Error getting invitation details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Get invitation by token
  const getInvitationByTokenString = async (token: string): Promise<Invitation | null> => {
    setLoading(true);
    clearError();
    
    try {
      return await getInvitationByToken(services, token);
    } catch (err) {
      setError(err as Error);
      console.error('Error getting invitation by token:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Get invitations for the current organization
  const getInvitationsForCurrentOrg = async (): Promise<Invitation[]> => {
    if (!currentOrganization) {
      return [];
    }
    
    setLoading(true);
    clearError();
    
    try {
      const orgInvitations = await getInvitationsByOrg(services, currentOrganization.id);
      setInvitations(orgInvitations);
      return orgInvitations;
    } catch (err) {
      setError(err as Error);
      console.error('Error getting invitations for organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel an invitation
  const cancelInvitationById = async (invitationId: string): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await cancelInvitation(services, invitationId);
      
      // Refresh invitations
      await loadInvitations();
    } catch (err) {
      setError(err as Error);
      console.error('Error canceling invitation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Accept an invitation
  const acceptInvitationById = async (invitationId: string, userId: string): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await acceptInvitation(services, invitationId, userId);
      
      // Refresh invitations
      await loadInvitations();
    } catch (err) {
      setError(err as Error);
      console.error('Error accepting invitation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Decline an invitation
  const declineInvitationById = async (invitationId: string): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await declineInvitation(services, invitationId);
      
      // Refresh invitations
      await loadInvitations();
    } catch (err) {
      setError(err as Error);
      console.error('Error declining invitation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Resend an invitation
  const resendInvitationById = async (
    invitationId: string,
    callbacks?: InvitationServiceCallbacks
  ): Promise<Invitation> => {
    setLoading(true);
    clearError();
    
    try {
      const updatedInvitation = await resendInvitation(services, invitationId, callbacks);
      
      // Refresh invitations
      await loadInvitations();
      
      return updatedInvitation;
    } catch (err) {
      setError(err as Error);
      console.error('Error resending invitation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh invitations
  const refreshInvitations = async (): Promise<void> => {
    await loadInvitations();
  };
  
  const contextValue: InvitationContextType = {
    invitations,
    loading,
    error,
    createNewInvitation,
    getInvitationDetails,
    getInvitationByTokenString,
    getInvitationsForCurrentOrg,
    cancelInvitationById,
    acceptInvitationById,
    declineInvitationById,
    resendInvitationById,
    refreshInvitations,
    clearError
  };
  
  return (
    <InvitationContext.Provider value={contextValue}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation(): InvitationContextType {
  const context = useContext(InvitationContext);
  
  if (!context) {
    throw new Error('useInvitation must be used within an InvitationProvider');
  }
  
  return context;
} 