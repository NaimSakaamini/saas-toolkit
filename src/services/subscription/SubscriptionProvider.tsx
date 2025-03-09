'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFirebase } from '@/services/firebase/FirebaseProvider';
import { useAuth } from '@/services/auth/AuthProvider';
import { useOrganization } from '@/services/organization/OrganizationProvider';
import { 
  PricingPlan,
  Subscription,
  PaymentMethod,
  Invoice,
  Usage,
  getPricingPlans,
  getPricingPlanById,
  createSubscription,
  getSubscription,
  getSubscriptionByOrgId,
  updateSubscription,
  cancelSubscription,
  createPaymentMethod,
  getPaymentMethodsByOrgId,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  createInvoice,
  getInvoicesByOrgId,
  recordUsage,
  getUsageByOrgIdAndMetric,
  getCurrentUsage
} from './subscriptionService';

interface SubscriptionContextType {
  currentSubscription: Subscription | null;
  currentPlan: PricingPlan | null;
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  usage: Record<string, number>;
  loading: boolean;
  error: Error | null;
  createNewSubscription: (planId: string) => Promise<string>;
  updateCurrentSubscription: (data: Partial<Subscription>) => Promise<void>;
  cancelCurrentSubscription: (cancelAtPeriodEnd?: boolean) => Promise<void>;
  addPaymentMethod: (paymentMethod: Partial<PaymentMethod>) => Promise<string>;
  setDefaultPaymentMethodById: (paymentMethodId: string) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshPaymentMethods: () => Promise<void>;
  refreshInvoices: () => Promise<void>;
  refreshUsage: () => Promise<void>;
  clearError: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { services } = useFirebase();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const clearError = () => setError(null);
  
  // Load subscription when the current organization changes
  useEffect(() => {
    if (currentOrganization) {
      loadSubscription();
      loadPaymentMethods();
      loadInvoices();
      loadUsage();
    } else {
      setCurrentSubscription(null);
      setCurrentPlan(null);
      setPaymentMethods([]);
      setInvoices([]);
      setUsage({});
    }
  }, [currentOrganization]);
  
  // Load subscription for the current organization
  const loadSubscription = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    clearError();
    
    try {
      const subscription = await getSubscriptionByOrgId(services, currentOrganization.id);
      setCurrentSubscription(subscription);
      
      if (subscription) {
        const plan = getPricingPlanById(subscription.planId);
        setCurrentPlan(plan);
      } else {
        // If no subscription exists, set to free plan
        setCurrentPlan(getPricingPlanById('free'));
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading subscription:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load payment methods for the current organization
  const loadPaymentMethods = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    clearError();
    
    try {
      const methods = await getPaymentMethodsByOrgId(services, currentOrganization.id);
      setPaymentMethods(methods);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading payment methods:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load invoices for the current organization
  const loadInvoices = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    clearError();
    
    try {
      const orgInvoices = await getInvoicesByOrgId(services, currentOrganization.id);
      setInvoices(orgInvoices);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load usage for the current organization
  const loadUsage = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    clearError();
    
    try {
      const currentUsage = await getCurrentUsage(services, currentOrganization.id);
      setUsage(currentUsage);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading usage:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new subscription
  const createNewSubscription = async (planId: string): Promise<string> => {
    if (!user || !currentOrganization) {
      throw new Error('User or organization not found');
    }
    
    setLoading(true);
    clearError();
    
    try {
      // Get the plan
      const plan = getPricingPlanById(planId);
      
      if (!plan) {
        throw new Error('Invalid plan ID');
      }
      
      // Set up subscription dates
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      
      // Create the subscription
      const subscriptionId = await createSubscription(services, {
        orgId: currentOrganization.id,
        userId: user.uid,
        planId: planId,
        status: planId === 'free' ? 'active' : 'trialing',
        currentPeriodStart: now,
        currentPeriodEnd: endDate,
        cancelAtPeriodEnd: false,
      });
      
      // Refresh subscription data
      await loadSubscription();
      
      return subscriptionId;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating subscription:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update the current subscription
  const updateCurrentSubscription = async (data: Partial<Subscription>): Promise<void> => {
    if (!currentSubscription) {
      throw new Error('No active subscription');
    }
    
    setLoading(true);
    clearError();
    
    try {
      await updateSubscription(services, currentSubscription.id, data);
      
      // Refresh subscription data
      await loadSubscription();
    } catch (err) {
      setError(err as Error);
      console.error('Error updating subscription:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel the current subscription
  const cancelCurrentSubscription = async (cancelAtPeriodEnd: boolean = true): Promise<void> => {
    if (!currentSubscription) {
      throw new Error('No active subscription');
    }
    
    setLoading(true);
    clearError();
    
    try {
      await cancelSubscription(services, currentSubscription.id, cancelAtPeriodEnd);
      
      // Refresh subscription data
      await loadSubscription();
    } catch (err) {
      setError(err as Error);
      console.error('Error canceling subscription:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add a payment method
  const addPaymentMethod = async (paymentMethod: Partial<PaymentMethod>): Promise<string> => {
    if (!user || !currentOrganization) {
      throw new Error('User or organization not found');
    }
    
    setLoading(true);
    clearError();
    
    try {
      // Add user and organization IDs if not provided
      if (!paymentMethod.userId) {
        paymentMethod.userId = user.uid;
      }
      
      if (!paymentMethod.orgId) {
        paymentMethod.orgId = currentOrganization.id;
      }
      
      // Create the payment method
      const paymentMethodId = await createPaymentMethod(services, paymentMethod);
      
      // If this is the first payment method, set it as default
      if (paymentMethods.length === 0) {
        await setDefaultPaymentMethod(services, paymentMethodId, currentOrganization.id);
      }
      
      // Refresh payment methods
      await loadPaymentMethods();
      
      return paymentMethodId;
    } catch (err) {
      setError(err as Error);
      console.error('Error adding payment method:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Set default payment method
  const setDefaultPaymentMethodById = async (paymentMethodId: string): Promise<void> => {
    if (!currentOrganization) {
      throw new Error('Organization not found');
    }
    
    setLoading(true);
    clearError();
    
    try {
      await setDefaultPaymentMethod(services, paymentMethodId, currentOrganization.id);
      
      // Refresh payment methods
      await loadPaymentMethods();
    } catch (err) {
      setError(err as Error);
      console.error('Error setting default payment method:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a payment method
  const removePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      await deletePaymentMethod(services, paymentMethodId);
      
      // Refresh payment methods
      await loadPaymentMethods();
    } catch (err) {
      setError(err as Error);
      console.error('Error removing payment method:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh subscription data
  const refreshSubscription = async (): Promise<void> => {
    await loadSubscription();
  };
  
  // Refresh payment methods
  const refreshPaymentMethods = async (): Promise<void> => {
    await loadPaymentMethods();
  };
  
  // Refresh invoices
  const refreshInvoices = async (): Promise<void> => {
    await loadInvoices();
  };
  
  // Refresh usage
  const refreshUsage = async (): Promise<void> => {
    await loadUsage();
  };
  
  const contextValue: SubscriptionContextType = {
    currentSubscription,
    currentPlan,
    paymentMethods,
    invoices,
    usage,
    loading,
    error,
    createNewSubscription,
    updateCurrentSubscription,
    cancelCurrentSubscription,
    addPaymentMethod,
    setDefaultPaymentMethodById,
    removePaymentMethod,
    refreshSubscription,
    refreshPaymentMethods,
    refreshInvoices,
    refreshUsage,
    clearError
  };
  
  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  
  return context;
} 