'use client';

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  Timestamp,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { FirebaseServices } from '@/services/firebase/config';
import { addUserToOrganization } from '@/services/organization/organizationService';

export interface Invitation {
  id: string;
  email: string;
  orgId: string;
  orgName: string;
  role: 'admin' | 'member';
  invitedBy: string;
  inviterName?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date | string;
  expiresAt: Date | string;
  token: string;
}

export interface InvitationServiceCallbacks {
  onInvitationCreated?: (invitation: Invitation) => void;
  onInvitationResent?: (invitation: Invitation) => void;
  onSuccess?: (invitationId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Generate a unique invitation token
 * 
 * @returns A unique token for the invitation
 */
const generateInvitationToken = (): string => {
  // Generate a random string of 32 characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Create a new invitation
 * 
 * @param services Firebase services
 * @param invitationData Invitation data
 * @param callbacks Optional callbacks
 * @returns Invitation ID
 */
export const createInvitation = async (
  services: FirebaseServices,
  invitationData: Partial<Invitation>,
  callbacks?: InvitationServiceCallbacks
): Promise<string> => {
  const { db } = services;
  
  try {
    // Create a new document reference
    const invitationRef = doc(collection(db, 'invitations'));
    const invitationId = invitationRef.id;
    
    // Generate token and set expiration date (30 days from now)
    const token = generateInvitationToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Set invitation data
    const invitation: Invitation = {
      id: invitationId,
      email: invitationData.email || '',
      orgId: invitationData.orgId || '',
      orgName: invitationData.orgName || '',
      role: invitationData.role || 'member',
      invitedBy: invitationData.invitedBy || '',
      inviterName: invitationData.inviterName,
      status: 'pending',
      createdAt: now,
      expiresAt: expiresAt,
      token: token
    };
    
    await setDoc(invitationRef, invitation);
    
    // Call the onInvitationCreated callback if provided
    if (callbacks?.onInvitationCreated) {
      callbacks.onInvitationCreated(invitation);
    }
    
    // Call the onSuccess callback if provided
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(invitationId);
    }
    
    return invitationId;
  } catch (error) {
    console.error('Error creating invitation:', error);
    
    // Call the onError callback if provided
    if (callbacks?.onError) {
      callbacks.onError(error as Error);
    }
    
    throw error;
  }
};

/**
 * Get invitation by ID
 * 
 * @param services Firebase services
 * @param invitationId Invitation ID
 * @returns Invitation data
 */
export const getInvitation = async (
  services: FirebaseServices,
  invitationId: string
): Promise<Invitation | null> => {
  const { db } = services;
  
  try {
    const invitationRef = doc(db, 'invitations', invitationId);
    const invitationDoc = await getDoc(invitationRef);
    
    if (invitationDoc.exists()) {
      return invitationDoc.data() as Invitation;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting invitation:', error);
    throw error;
  }
};

/**
 * Get invitation by token
 * 
 * @param services Firebase services
 * @param token Invitation token
 * @returns Invitation data
 */
export const getInvitationByToken = async (
  services: FirebaseServices,
  token: string
): Promise<Invitation | null> => {
  const { db } = services;
  
  try {
    const q = query(
      collection(db, 'invitations'),
      where('token', '==', token),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Invitation;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting invitation by token:', error);
    throw error;
  }
};

/**
 * Get invitations by email
 * 
 * @param services Firebase services
 * @param email Email address
 * @returns Array of invitations
 */
export const getInvitationsByEmail = async (
  services: FirebaseServices,
  email: string
): Promise<Invitation[]> => {
  const { db } = services;
  
  try {
    const q = query(
      collection(db, 'invitations'),
      where('email', '==', email),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    const invitations: Invitation[] = [];
    
    querySnapshot.forEach((doc) => {
      invitations.push(doc.data() as Invitation);
    });
    
    return invitations;
  } catch (error) {
    console.error('Error getting invitations by email:', error);
    throw error;
  }
};

/**
 * Get invitations by organization
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @returns Array of invitations
 */
export const getInvitationsByOrg = async (
  services: FirebaseServices,
  orgId: string
): Promise<Invitation[]> => {
  const { db } = services;
  
  try {
    const q = query(
      collection(db, 'invitations'),
      where('orgId', '==', orgId)
    );
    
    const querySnapshot = await getDocs(q);
    const invitations: Invitation[] = [];
    
    querySnapshot.forEach((doc) => {
      invitations.push(doc.data() as Invitation);
    });
    
    return invitations;
  } catch (error) {
    console.error('Error getting invitations by organization:', error);
    throw error;
  }
};

/**
 * Update invitation status
 * 
 * @param services Firebase services
 * @param invitationId Invitation ID
 * @param status New status
 */
export const updateInvitationStatus = async (
  services: FirebaseServices,
  invitationId: string,
  status: 'accepted' | 'declined'
): Promise<void> => {
  const { db } = services;
  
  try {
    const invitationRef = doc(db, 'invitations', invitationId);
    
    await updateDoc(invitationRef, {
      status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating invitation status:', error);
    throw error;
  }
};

/**
 * Cancel an invitation
 * 
 * @param services Firebase services
 * @param invitationId Invitation ID
 */
export const cancelInvitation = async (
  services: FirebaseServices,
  invitationId: string
): Promise<void> => {
  const { db } = services;
  
  try {
    const invitationRef = doc(db, 'invitations', invitationId);
    
    await updateDoc(invitationRef, {
      status: 'declined',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error canceling invitation:', error);
    throw error;
  }
};

/**
 * Accept an invitation
 * 
 * @param services Firebase services
 * @param invitationId Invitation ID
 * @param userId User ID
 */
export const acceptInvitation = async (
  services: FirebaseServices,
  invitationId: string,
  userId: string
): Promise<void> => {
  const { db } = services;
  
  try {
    // Get the invitation
    const invitation = await getInvitation(services, invitationId);
    
    if (!invitation) {
      throw new Error('Invitation not found');
    }
    
    // Check if the invitation is still pending
    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer pending');
    }
    
    // Check if the invitation has expired
    const expiresAt = typeof invitation.expiresAt === 'string' 
      ? new Date(invitation.expiresAt) 
      : invitation.expiresAt;
    
    if (expiresAt < new Date()) {
      throw new Error('Invitation has expired');
    }
    
    // Add the user to the organization
    await addUserToOrganization(
      services,
      invitation.orgId,
      userId,
      invitation.role
    );
    
    // Update the invitation status
    await updateInvitationStatus(services, invitationId, 'accepted');
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

/**
 * Decline an invitation
 * 
 * @param services Firebase services
 * @param invitationId Invitation ID
 */
export const declineInvitation = async (
  services: FirebaseServices,
  invitationId: string
): Promise<void> => {
  const { db } = services;
  
  try {
    // Update the invitation status
    await updateInvitationStatus(services, invitationId, 'declined');
  } catch (error) {
    console.error('Error declining invitation:', error);
    throw error;
  }
};

/**
 * Resend an invitation
 * 
 * @param services Firebase services
 * @param invitationId Invitation ID
 * @param callbacks Optional callbacks
 * @returns Updated invitation
 */
export const resendInvitation = async (
  services: FirebaseServices,
  invitationId: string,
  callbacks?: InvitationServiceCallbacks
): Promise<Invitation> => {
  const { db } = services;
  
  try {
    // Get the invitation
    const invitation = await getInvitation(services, invitationId);
    
    if (!invitation) {
      throw new Error('Invitation not found');
    }
    
    // Generate a new token and update the expiration date
    const token = generateInvitationToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Update the invitation
    const invitationRef = doc(db, 'invitations', invitationId);
    
    await updateDoc(invitationRef, {
      token,
      expiresAt,
      status: 'pending',
      updatedAt: now
    });
    
    // Get the updated invitation
    const updatedInvitation = await getInvitation(services, invitationId);
    
    if (!updatedInvitation) {
      throw new Error('Failed to get updated invitation');
    }
    
    // Call the onInvitationResent callback if provided
    if (callbacks?.onInvitationResent) {
      callbacks.onInvitationResent(updatedInvitation);
    }
    
    // Call the onSuccess callback if provided
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(invitationId);
    }
    
    return updatedInvitation;
  } catch (error) {
    console.error('Error resending invitation:', error);
    
    // Call the onError callback if provided
    if (callbacks?.onError) {
      callbacks.onError(error as Error);
    }
    
    throw error;
  }
}; 