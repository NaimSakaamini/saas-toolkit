/**
 * Firebase Subscription Collections Setup Script
 * 
 * This script initializes the necessary collections for the subscription system in Firebase.
 * It creates sample documents for subscriptions, invoices, payment methods, and usage.
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  Timestamp 
} = require('firebase/firestore');

// Replace with your Firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data
const sampleOrgId = 'sample-org-id'; // Replace with a real organization ID
const sampleUserId = 'sample-user-id'; // Replace with a real user ID

// Create a sample subscription
async function createSampleSubscription() {
  const subscriptionRef = doc(collection(db, 'subscriptions'));
  const subscriptionId = subscriptionRef.id;
  
  const now = Timestamp.now();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  
  await setDoc(subscriptionRef, {
    id: subscriptionId,
    orgId: sampleOrgId,
    userId: sampleUserId,
    planId: 'free',
    status: 'active',
    currentPeriodStart: now,
    currentPeriodEnd: Timestamp.fromDate(endDate),
    cancelAtPeriodEnd: false,
    createdAt: now,
    updatedAt: now
  });
  
  console.log(`Created sample subscription with ID: ${subscriptionId}`);
  return subscriptionId;
}

// Create a sample invoice
async function createSampleInvoice(subscriptionId) {
  const invoiceRef = doc(collection(db, 'invoices'));
  const invoiceId = invoiceRef.id;
  
  const now = Timestamp.now();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  
  await setDoc(invoiceRef, {
    id: invoiceId,
    orgId: sampleOrgId,
    userId: sampleUserId,
    subscriptionId: subscriptionId,
    amount: 0,
    currency: 'USD',
    status: 'paid',
    stripeInvoiceId: 'sample-stripe-invoice-id',
    periodStart: Timestamp.fromDate(startDate),
    periodEnd: now,
    createdAt: now
  });
  
  console.log(`Created sample invoice with ID: ${invoiceId}`);
}

// Create a sample payment method
async function createSamplePaymentMethod() {
  const paymentMethodRef = doc(collection(db, 'paymentMethods'));
  const paymentMethodId = paymentMethodRef.id;
  
  const now = Timestamp.now();
  
  await setDoc(paymentMethodRef, {
    id: paymentMethodId,
    userId: sampleUserId,
    orgId: sampleOrgId,
    type: 'card',
    isDefault: true,
    details: {
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025
    },
    stripePaymentMethodId: 'sample-stripe-payment-method-id',
    createdAt: now
  });
  
  console.log(`Created sample payment method with ID: ${paymentMethodId}`);
}

// Create sample usage records
async function createSampleUsage() {
  const metrics = ['storage', 'members', 'organizations'];
  const now = Timestamp.now();
  
  for (const metric of metrics) {
    const usageRef = doc(collection(db, 'usage'));
    const usageId = usageRef.id;
    
    await setDoc(usageRef, {
      id: usageId,
      orgId: sampleOrgId,
      metric: metric,
      value: metric === 'storage' ? 0.5 : 1, // 0.5 GB storage, 1 member, 1 organization
      timestamp: now
    });
    
    console.log(`Created sample usage record for ${metric} with ID: ${usageId}`);
  }
}

// Run the setup
async function setupSubscriptionCollections() {
  try {
    console.log('Setting up subscription collections...');
    
    const subscriptionId = await createSampleSubscription();
    await createSampleInvoice(subscriptionId);
    await createSamplePaymentMethod();
    await createSampleUsage();
    
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error setting up subscription collections:', error);
  }
}

setupSubscriptionCollections(); 