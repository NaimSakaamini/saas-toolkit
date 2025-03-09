'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirebase } from '@/services/firebase/FirebaseProvider';
import { useAuth } from '@/services/auth/AuthProvider';
import { 
  Organization, 
  OrganizationMember,
  createOrganization,
  getOrganization,
  getUserOrganizations,
  updateOrganization,
  deleteOrganization,
  addUserToOrganization,
  removeUserFromOrganization,
  changeUserRole,
  setCurrentOrganization as setCurrentOrg
} from './organizationService';
import { doc, getDoc } from 'firebase/firestore';

interface OrganizationContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  loading: boolean;
  error: Error | null;
  createNewOrganization: (orgData: Partial<Organization>) => Promise<string>;
  updateOrgDetails: (orgId: string, orgData: Partial<Organization>) => Promise<void>;
  deleteOrg: (orgId: string) => Promise<void>;
  addMember: (orgId: string, userId: string, role: 'admin' | 'member') => Promise<void>;
  removeMember: (orgId: string, userId: string) => Promise<void>;
  changeRole: (orgId: string, userId: string, newRole: 'owner' | 'admin' | 'member') => Promise<void>;
  setCurrentOrganization: (orgId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
  clearError: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const { services } = useFirebase();
  const { user } = useAuth();
  
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const clearError = () => setError(null);
  
  // Load user's organizations
  useEffect(() => {
    if (user) {
      loadOrganizations();
    } else {
      setOrganizations([]);
      setCurrentOrganization(null);
      setLoading(false);
    }
  }, [user]);
  
  // Load organizations
  const loadOrganizations = async () => {
    if (!user) return;
    
    setLoading(true);
    clearError();
    
    try {
      const orgs = await getUserOrganizations(services, user.uid);
      setOrganizations(orgs);
      
      // Get user profile to check for current organization
      const userRef = doc(services.db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : null;
      const currentOrgId = userData?.currentOrganization;
      
      // Load current organization if user has one
      if (currentOrgId && orgs.length > 0) {
        const currentOrg = orgs.find(org => org.id === currentOrgId);
        
        if (currentOrg) {
          setCurrentOrganization(currentOrg);
        } else {
          // Set first organization as current if current org not found
          setCurrentOrganization(orgs[0]);
        }
      } else if (orgs.length > 0) {
        // Set first organization as current if user has no current org
        setCurrentOrganization(orgs[0]);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading organizations:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new organization
  const createNewOrganization = async (orgData: Partial<Organization>): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    clearError();
    
    try {
      // Add owner ID if not provided
      if (!orgData.ownerId) {
        orgData.ownerId = user.uid;
      }
      
      // Add user information to the organization
      const userEmail = user.email || '';
      const userName = user.displayName || userEmail.split('@')[0];
      
      // Create the organization
      const orgId = await createOrganization(services, {
        ...orgData,
        ownerId: user.uid,
        members: [{
          userId: user.uid,
          name: userName,
          email: userEmail,
          role: 'owner',
          joinedAt: new Date()
        }]
      });
      
      // Refresh organizations
      await loadOrganizations();
      
      return orgId;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update organization details
  const updateOrgDetails = async (orgId: string, orgData: Partial<Organization>): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await updateOrganization(services, orgId, orgData);
      
      // Refresh organizations
      await loadOrganizations();
    } catch (err) {
      setError(err as Error);
      console.error('Error updating organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete an organization
  const deleteOrg = async (orgId: string): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await deleteOrganization(services, orgId);
      
      // Refresh organizations
      await loadOrganizations();
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a member to an organization
  const addMember = async (orgId: string, userId: string, role: 'admin' | 'member'): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await addUserToOrganization(services, orgId, userId, role);
      
      // Refresh organizations
      await loadOrganizations();
    } catch (err) {
      setError(err as Error);
      console.error('Error adding member to organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a member from an organization
  const removeMember = async (orgId: string, userId: string): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await removeUserFromOrganization(services, orgId, userId);
      
      // Refresh organizations
      await loadOrganizations();
    } catch (err) {
      setError(err as Error);
      console.error('Error removing member from organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Change a member's role
  const changeRole = async (orgId: string, userId: string, newRole: 'owner' | 'admin' | 'member'): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await changeUserRole(services, orgId, userId, newRole);
      
      // Refresh organizations
      await loadOrganizations();
    } catch (err) {
      setError(err as Error);
      console.error('Error changing member role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Set current organization
  const handleSetCurrentOrganization = async (orgId: string): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    clearError();
    
    try {
      await setCurrentOrg(services, user.uid, orgId);
      
      // Find and set the current organization
      const org = organizations.find(org => org.id === orgId);
      if (org) {
        setCurrentOrganization(org);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error setting current organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh organizations
  const refreshOrganizations = async (): Promise<void> => {
    await loadOrganizations();
  };
  
  const contextValue: OrganizationContextType = {
    organizations,
    currentOrganization,
    loading,
    error,
    createNewOrganization,
    updateOrgDetails,
    deleteOrg,
    addMember,
    removeMember,
    changeRole,
    setCurrentOrganization: handleSetCurrentOrganization,
    refreshOrganizations,
    clearError
  };
  
  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextType {
  const context = useContext(OrganizationContext);
  
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  
  return context;
} 