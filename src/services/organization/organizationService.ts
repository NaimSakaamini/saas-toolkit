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
  arrayRemove
} from 'firebase/firestore';
import { FirebaseServices } from '@/services/firebase/config';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string;
  ownerId: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  members: OrganizationMember[];
  settings?: Record<string, any>;
}

export interface OrganizationMember {
  userId: string;
  name?: string;
  email?: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date | string;
}

/**
 * Create a new organization
 * 
 * @param services Firebase services
 * @param orgData Organization data
 * @returns Organization ID
 */
export const createOrganization = async (
  services: FirebaseServices,
  orgData: Partial<Organization>
): Promise<string> => {
  const { db } = services;
  
  try {
    // Create a new document reference
    const orgRef = doc(collection(db, 'organizations'));
    const orgId = orgRef.id;
    
    const timestamp = new Date();
    
    // Set organization data
    await setDoc(orgRef, {
      id: orgId,
      ...orgData,
      createdAt: timestamp,
      updatedAt: timestamp,
      members: [{
        userId: orgData.ownerId,
        role: 'owner',
        joinedAt: timestamp
      }]
    });
    
    // Add organization to user's organizations
    if (orgData.ownerId) {
      const userRef = doc(db, 'users', orgData.ownerId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          organizations: arrayUnion({
            orgId,
            role: 'owner'
          }),
          currentOrganization: orgId
        });
      }
    }
    
    return orgId;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

/**
 * Get organization by ID
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @returns Organization data
 */
export const getOrganization = async (
  services: FirebaseServices,
  orgId: string
): Promise<Organization | null> => {
  const { db } = services;
  
  try {
    const orgRef = doc(db, 'organizations', orgId);
    const orgDoc = await getDoc(orgRef);
    
    if (orgDoc.exists()) {
      return orgDoc.data() as Organization;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting organization:', error);
    throw error;
  }
};

/**
 * Get organizations for a user
 * 
 * @param services Firebase services
 * @param userId User ID
 * @returns Array of organizations
 */
export const getUserOrganizations = async (
  services: FirebaseServices,
  userId: string
): Promise<Organization[]> => {
  const { db } = services;
  
  try {
    // First, get the user's profile to check their organizations
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return [];
    }
    
    const userData = userDoc.data();
    const userOrgs = userData.organizations || [];
    
    if (userOrgs.length === 0) {
      return [];
    }
    
    // Get all organizations that the user is a member of
    const organizations: Organization[] = [];
    
    // Get each organization by ID
    for (const org of userOrgs) {
      const orgRef = doc(db, 'organizations', org.orgId);
      const orgDoc = await getDoc(orgRef);
      
      if (orgDoc.exists()) {
        organizations.push(orgDoc.data() as Organization);
      }
    }
    
    return organizations;
  } catch (error) {
    console.error('Error getting user organizations:', error);
    throw error;
  }
};

/**
 * Update organization details
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @param orgData Organization data to update
 */
export const updateOrganization = async (
  services: FirebaseServices,
  orgId: string,
  orgData: Partial<Organization>
): Promise<void> => {
  const { db } = services;
  
  try {
    const orgRef = doc(db, 'organizations', orgId);
    
    await updateDoc(orgRef, {
      ...orgData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

/**
 * Delete an organization
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 */
export const deleteOrganization = async (
  services: FirebaseServices,
  orgId: string
): Promise<void> => {
  const { db } = services;
  
  try {
    const orgRef = doc(db, 'organizations', orgId);
    await deleteDoc(orgRef);
  } catch (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
};

/**
 * Add a user to an organization
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @param userId User ID
 * @param role User role
 */
export const addUserToOrganization = async (
  services: FirebaseServices,
  orgId: string,
  userId: string,
  role: 'admin' | 'member'
): Promise<void> => {
  const { db } = services;
  
  try {
    // Add user to organization
    const orgRef = doc(db, 'organizations', orgId);
    const orgDoc = await getDoc(orgRef);
    
    if (orgDoc.exists()) {
      const org = orgDoc.data() as Organization;
      const members = org.members || [];
      
      // Check if user is already a member
      const existingMember = members.find(member => member.userId === userId);
      
      if (existingMember) {
        // Update role if user is already a member
        await updateDoc(orgRef, {
          members: members.map(member => 
            member.userId === userId 
              ? { ...member, role } 
              : member
          )
        });
      } else {
        // Add user as a new member
        await updateDoc(orgRef, {
          members: [...members, {
            userId,
            role,
            joinedAt: new Date()
          }]
        });
      }
      
      // Add organization to user's organizations
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const organizations = userData.organizations || [];
        
        // Check if user already has this organization
        const existingOrg = organizations.find((org: any) => org.orgId === orgId);
        
        if (!existingOrg) {
          await updateDoc(userRef, {
            organizations: [...organizations, {
              orgId,
              role
            }]
          });
        }
      }
    }
  } catch (error) {
    console.error('Error adding user to organization:', error);
    throw error;
  }
};

/**
 * Remove a user from an organization
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @param userId User ID
 */
export const removeUserFromOrganization = async (
  services: FirebaseServices,
  orgId: string,
  userId: string
): Promise<void> => {
  const { db } = services;
  
  try {
    // Remove user from organization
    const orgRef = doc(db, 'organizations', orgId);
    const orgDoc = await getDoc(orgRef);
    
    if (orgDoc.exists()) {
      const org = orgDoc.data() as Organization;
      const members = org.members || [];
      
      await updateDoc(orgRef, {
        members: members.filter(member => member.userId !== userId)
      });
      
      // Remove organization from user's organizations
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const organizations = userData.organizations || [];
        
        await updateDoc(userRef, {
          organizations: organizations.filter((org: any) => org.orgId !== orgId)
        });
      }
    }
  } catch (error) {
    console.error('Error removing user from organization:', error);
    throw error;
  }
};

/**
 * Change a user's role in an organization
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @param userId User ID
 * @param newRole New role
 */
export const changeUserRole = async (
  services: FirebaseServices,
  orgId: string,
  userId: string,
  newRole: 'owner' | 'admin' | 'member'
): Promise<void> => {
  const { db } = services;
  
  try {
    // Update user's role in organization
    const orgRef = doc(db, 'organizations', orgId);
    const orgDoc = await getDoc(orgRef);
    
    if (orgDoc.exists()) {
      const org = orgDoc.data() as Organization;
      const members = org.members || [];
      
      await updateDoc(orgRef, {
        members: members.map(member => 
          member.userId === userId 
            ? { ...member, role: newRole } 
            : member
        )
      });
      
      // Update role in user's organizations
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const organizations = userData.organizations || [];
        
        await updateDoc(userRef, {
          organizations: organizations.map((org: any) => 
            org.orgId === orgId 
              ? { ...org, role: newRole } 
              : org
          )
        });
      }
    }
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

/**
 * Set current organization for a user
 * 
 * @param services Firebase services
 * @param userId User ID
 * @param orgId Organization ID
 */
export const setCurrentOrganization = async (
  services: FirebaseServices,
  userId: string,
  orgId: string
): Promise<void> => {
  const { db } = services;
  
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      currentOrganization: orgId
    });
  } catch (error) {
    console.error('Error setting current organization:', error);
    throw error;
  }
}; 