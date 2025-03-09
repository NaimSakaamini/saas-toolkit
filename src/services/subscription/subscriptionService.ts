'use client';

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { FirebaseServices } from '@/services/firebase/config';

// Subscription plan types
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  limits: {
    organizations: number;
    membersPerOrg: number;
    storage: number; // in GB
    [key: string]: any;
  };
}

// Subscription types
export interface Subscription {
  id: string;
  orgId: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

// Payment method types
export interface PaymentMethod {
  id: string;
  userId: string;
  orgId: string;
  type: 'card' | 'bank_account';
  isDefault: boolean;
  details: {
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
    bankName?: string;
  };
  stripePaymentMethodId: string;
  createdAt: Date | string;
}

// Invoice types
export interface Invoice {
  id: string;
  orgId: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  invoiceUrl?: string;
  invoicePdfUrl?: string;
  stripeInvoiceId: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  createdAt: Date | string;
}

// Usage types
export interface Usage {
  id: string;
  orgId: string;
  metric: string;
  value: number;
  timestamp: Date | string;
}

// Predefined plans
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'For individuals and small teams just getting started',
    price: 0,
    interval: 'month',
    features: [
      '1 Organization',
      '5 Team Members',
      '5GB Storage',
      'Basic Support',
    ],
    stripePriceId: 'price_free',
    limits: {
      organizations: 1,
      membersPerOrg: 5,
      storage: 5,
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams that need more power and flexibility',
    price: 29,
    interval: 'month',
    features: [
      '3 Organizations',
      '20 Team Members per Org',
      '50GB Storage',
      'Priority Support',
      'Advanced Analytics',
    ],
    stripePriceId: 'price_pro_monthly',
    limits: {
      organizations: 3,
      membersPerOrg: 20,
      storage: 50,
    }
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For larger teams and businesses with advanced needs',
    price: 99,
    interval: 'month',
    features: [
      '10 Organizations',
      'Unlimited Team Members',
      '500GB Storage',
      'Premium Support',
      'Advanced Analytics',
      'Custom Branding',
    ],
    stripePriceId: 'price_business_monthly',
    limits: {
      organizations: 10,
      membersPerOrg: Infinity,
      storage: 500,
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    price: 299,
    interval: 'month',
    features: [
      'Unlimited Organizations',
      'Unlimited Team Members',
      '2TB Storage',
      'Dedicated Support',
      'Advanced Analytics',
      'Custom Branding',
      'Custom Integrations',
    ],
    stripePriceId: 'price_enterprise_monthly',
    limits: {
      organizations: Infinity,
      membersPerOrg: Infinity,
      storage: 2000,
    }
  }
];

/**
 * Get all available pricing plans
 * 
 * @returns Array of pricing plans
 */
export const getPricingPlans = (): PricingPlan[] => {
  return PRICING_PLANS;
};

/**
 * Get a specific pricing plan by ID
 * 
 * @param planId Plan ID
 * @returns Pricing plan or null if not found
 */
export const getPricingPlanById = (planId: string): PricingPlan | null => {
  return PRICING_PLANS.find(plan => plan.id === planId) || null;
};

/**
 * Create a new subscription
 * 
 * @param services Firebase services
 * @param subscription Subscription data
 * @returns Subscription ID
 */
export const createSubscription = async (
  services: FirebaseServices,
  subscription: Partial<Subscription>
): Promise<string> => {
  const { db } = services;
  
  try {
    // Create a new document reference
    const subscriptionRef = doc(collection(db, 'subscriptions'));
    const subscriptionId = subscriptionRef.id;
    
    const now = new Date();
    
    // Set subscription data
    await setDoc(subscriptionRef, {
      id: subscriptionId,
      ...subscription,
      createdAt: now,
      updatedAt: now,
    });
    
    return subscriptionId;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Get subscription by ID
 * 
 * @param services Firebase services
 * @param subscriptionId Subscription ID
 * @returns Subscription data
 */
export const getSubscription = async (
  services: FirebaseServices,
  subscriptionId: string
): Promise<Subscription | null> => {
  const { db } = services;
  
  try {
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    const subscriptionDoc = await getDoc(subscriptionRef);
    
    if (subscriptionDoc.exists()) {
      return subscriptionDoc.data() as Subscription;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw error;
  }
};

/**
 * Get subscription by organization ID
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @returns Subscription data
 */
export const getSubscriptionByOrgId = async (
  services: FirebaseServices,
  orgId: string
): Promise<Subscription | null> => {
  const { db } = services;
  
  try {
    const q = query(
      collection(db, 'subscriptions'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Subscription;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting subscription by organization ID:', error);
    throw error;
  }
};

/**
 * Update subscription
 * 
 * @param services Firebase services
 * @param subscriptionId Subscription ID
 * @param data Subscription data to update
 */
export const updateSubscription = async (
  services: FirebaseServices,
  subscriptionId: string,
  data: Partial<Subscription>
): Promise<void> => {
  const { db } = services;
  
  try {
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    
    await updateDoc(subscriptionRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 * 
 * @param services Firebase services
 * @param subscriptionId Subscription ID
 * @param cancelAtPeriodEnd Whether to cancel at the end of the current period
 */
export const cancelSubscription = async (
  services: FirebaseServices,
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<void> => {
  const { db } = services;
  
  try {
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    
    await updateDoc(subscriptionRef, {
      cancelAtPeriodEnd,
      updatedAt: new Date(),
    });
    
    // If canceling immediately, update status
    if (!cancelAtPeriodEnd) {
      await updateDoc(subscriptionRef, {
        status: 'canceled',
      });
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

/**
 * Create a payment method
 * 
 * @param services Firebase services
 * @param paymentMethod Payment method data
 * @returns Payment method ID
 */
export const createPaymentMethod = async (
  services: FirebaseServices,
  paymentMethod: Partial<PaymentMethod>
): Promise<string> => {
  const { db } = services;
  
  try {
    // Create a new document reference
    const paymentMethodRef = doc(collection(db, 'paymentMethods'));
    const paymentMethodId = paymentMethodRef.id;
    
    // Set payment method data
    await setDoc(paymentMethodRef, {
      id: paymentMethodId,
      ...paymentMethod,
      createdAt: new Date(),
    });
    
    return paymentMethodId;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

/**
 * Get payment methods by organization ID
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @returns Array of payment methods
 */
export const getPaymentMethodsByOrgId = async (
  services: FirebaseServices,
  orgId: string
): Promise<PaymentMethod[]> => {
  const { db } = services;
  
  try {
    const q = query(
      collection(db, 'paymentMethods'),
      where('orgId', '==', orgId)
    );
    
    const querySnapshot = await getDocs(q);
    const paymentMethods: PaymentMethod[] = [];
    
    querySnapshot.forEach((doc) => {
      paymentMethods.push(doc.data() as PaymentMethod);
    });
    
    return paymentMethods;
  } catch (error) {
    console.error('Error getting payment methods by organization ID:', error);
    throw error;
  }
};

/**
 * Set default payment method
 * 
 * @param services Firebase services
 * @param paymentMethodId Payment method ID
 * @param orgId Organization ID
 */
export const setDefaultPaymentMethod = async (
  services: FirebaseServices,
  paymentMethodId: string,
  orgId: string
): Promise<void> => {
  const { db } = services;
  
  try {
    // Get all payment methods for the organization
    const paymentMethods = await getPaymentMethodsByOrgId(services, orgId);
    
    // Update each payment method
    for (const pm of paymentMethods) {
      const paymentMethodRef = doc(db, 'paymentMethods', pm.id);
      
      await updateDoc(paymentMethodRef, {
        isDefault: pm.id === paymentMethodId,
      });
    }
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

/**
 * Delete payment method
 * 
 * @param services Firebase services
 * @param paymentMethodId Payment method ID
 */
export const deletePaymentMethod = async (
  services: FirebaseServices,
  paymentMethodId: string
): Promise<void> => {
  const { db } = services;
  
  try {
    const paymentMethodRef = doc(db, 'paymentMethods', paymentMethodId);
    
    // Get the payment method to check if it's the default
    const paymentMethodDoc = await getDoc(paymentMethodRef);
    
    if (paymentMethodDoc.exists()) {
      const paymentMethod = paymentMethodDoc.data() as PaymentMethod;
      
      // Don't allow deleting the default payment method
      if (paymentMethod.isDefault) {
        throw new Error('Cannot delete the default payment method');
      }
      
      // Delete the payment method
      await updateDoc(paymentMethodRef, {
        deleted: true,
      });
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

/**
 * Create an invoice
 * 
 * @param services Firebase services
 * @param invoice Invoice data
 * @returns Invoice ID
 */
export const createInvoice = async (
  services: FirebaseServices,
  invoice: Partial<Invoice>
): Promise<string> => {
  const { db } = services;
  
  try {
    // Create a new document reference
    const invoiceRef = doc(collection(db, 'invoices'));
    const invoiceId = invoiceRef.id;
    
    // Set invoice data
    await setDoc(invoiceRef, {
      id: invoiceId,
      ...invoice,
      createdAt: new Date(),
    });
    
    return invoiceId;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

/**
 * Get invoices by organization ID
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @returns Array of invoices
 */
export const getInvoicesByOrgId = async (
  services: FirebaseServices,
  orgId: string
): Promise<Invoice[]> => {
  const { db } = services;
  
  try {
    const q = query(
      collection(db, 'invoices'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const invoices: Invoice[] = [];
    
    querySnapshot.forEach((doc) => {
      invoices.push(doc.data() as Invoice);
    });
    
    return invoices;
  } catch (error) {
    console.error('Error getting invoices by organization ID:', error);
    throw error;
  }
};

/**
 * Record usage
 * 
 * @param services Firebase services
 * @param usage Usage data
 * @returns Usage ID
 */
export const recordUsage = async (
  services: FirebaseServices,
  usage: Partial<Usage>
): Promise<string> => {
  const { db } = services;
  
  try {
    // Create a new document reference
    const usageRef = doc(collection(db, 'usage'));
    const usageId = usageRef.id;
    
    // Set usage data
    await setDoc(usageRef, {
      id: usageId,
      ...usage,
      timestamp: new Date(),
    });
    
    return usageId;
  } catch (error) {
    console.error('Error recording usage:', error);
    throw error;
  }
};

/**
 * Get usage by organization ID and metric
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @param metric Metric name
 * @returns Array of usage records
 */
export const getUsageByOrgIdAndMetric = async (
  services: FirebaseServices,
  orgId: string,
  metric: string
): Promise<Usage[]> => {
  const { db } = services;
  
  try {
    const q = query(
      collection(db, 'usage'),
      where('orgId', '==', orgId),
      where('metric', '==', metric),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const usageRecords: Usage[] = [];
    
    querySnapshot.forEach((doc) => {
      usageRecords.push(doc.data() as Usage);
    });
    
    return usageRecords;
  } catch (error) {
    console.error('Error getting usage by organization ID and metric:', error);
    throw error;
  }
};

/**
 * Get current usage for an organization
 * 
 * @param services Firebase services
 * @param orgId Organization ID
 * @returns Object with current usage values
 */
export const getCurrentUsage = async (
  services: FirebaseServices,
  orgId: string
): Promise<Record<string, number>> => {
  const { db } = services;
  
  try {
    // Define the metrics to track
    const metrics = ['storage', 'members', 'organizations'];
    const usage: Record<string, number> = {};
    
    // Get the latest usage for each metric
    for (const metric of metrics) {
      const q = query(
        collection(db, 'usage'),
        where('orgId', '==', orgId),
        where('metric', '==', metric),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const usageRecord = querySnapshot.docs[0].data() as Usage;
        usage[metric] = usageRecord.value;
      } else {
        usage[metric] = 0;
      }
    }
    
    return usage;
  } catch (error) {
    console.error('Error getting current usage:', error);
    throw error;
  }
}; 