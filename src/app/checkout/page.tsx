'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Group, 
  Button, 
  TextInput, 
  Select, 
  Divider, 
  Stack,
  Alert,
  List,
  ThemeIcon,
  rem,
  Grid,
  Box,
  Stepper
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconAlertCircle, IconCreditCard } from '@tabler/icons-react';
import { useAuth } from '@/services/auth/AuthProvider';
import { useSubscription } from '@/services/subscription/SubscriptionProvider';
import { getPricingPlanById } from '@/services/subscription/subscriptionService';
import { AppLayout } from '@/components/layout/AppLayout';

interface PaymentFormValues {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  country: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { 
    createNewSubscription, 
    addPaymentMethod,
    loading: subscriptionLoading, 
    error,
    clearError
  } = useSubscription();
  
  const [planId, setPlanId] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<string>('monthly');
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Get plan and billing cycle from URL params
  useEffect(() => {
    const planParam = searchParams.get('plan');
    const billingParam = searchParams.get('billing');
    
    if (planParam) {
      setPlanId(planParam);
    } else {
      // Redirect to pricing if no plan is specified
      router.push('/pricing');
    }
    
    if (billingParam && (billingParam === 'monthly' || billingParam === 'yearly')) {
      setBillingCycle(billingParam);
    }
  }, [searchParams, router]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/pricing');
    }
  }, [user, authLoading, router]);
  
  // Get plan details
  const plan = planId ? getPricingPlanById(planId) : null;
  
  // Calculate price based on billing cycle
  const getPrice = () => {
    if (!plan) return '$0';
    
    const monthlyPrice = plan.price;
    const yearlyPrice = plan.price * 10; // 2 months free with yearly billing
    
    return billingCycle === 'yearly' 
      ? `$${yearlyPrice}/year` 
      : `$${monthlyPrice}/month`;
  };
  
  // Payment form
  const form = useForm<PaymentFormValues>({
    initialValues: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      country: 'US',
      postalCode: ''
    },
    validate: {
      cardNumber: (value) => (value.length < 16 ? 'Card number must be at least 16 digits' : null),
      cardName: (value) => (value.length < 3 ? 'Name on card is required' : null),
      expiryDate: (value) => (/^\d{2}\/\d{2}$/.test(value) ? null : 'Use format MM/YY'),
      cvv: (value) => (/^\d{3,4}$/.test(value) ? null : 'CVV must be 3 or 4 digits'),
      postalCode: (value) => (value.length < 3 ? 'Postal code is required' : null)
    }
  });
  
  // Handle form submission
  const handleSubmit = async (values: PaymentFormValues) => {
    if (!user || !plan) return;
    
    setProcessingPayment(true);
    clearError();
    
    try {
      // First add the payment method
      const paymentMethodId = await addPaymentMethod({
        type: 'card',
        cardBrand: 'visa', // This would be determined by the actual payment processor
        last4: values.cardNumber.slice(-4),
        expiryMonth: parseInt(values.expiryDate.split('/')[0]),
        expiryYear: parseInt('20' + values.expiryDate.split('/')[1]),
        billingDetails: {
          name: values.cardName,
          country: values.country,
          postalCode: values.postalCode
        },
        isDefault: true
      });
      
      // Then create the subscription
      await createNewSubscription(planId);
      
      // Show success message and move to next step
      setSuccess(true);
      setActiveStep(2);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Error processing payment:', err);
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Handle going to next step
  const nextStep = () => {
    setActiveStep((current) => current + 1);
  };
  
  // Handle going to previous step
  const prevStep = () => {
    setActiveStep((current) => current - 1);
  };
  
  if (!plan) {
    return (
      <AppLayout>
        <Container size="sm" py="xl">
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Plan not found" 
            color="red"
          >
            The selected plan could not be found. Please return to the pricing page and try again.
          </Alert>
          <Button 
            onClick={() => router.push('/pricing')} 
            mt="md"
            variant="outline"
          >
            Return to Pricing
          </Button>
        </Container>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <Container size="md" py="xl">
        <Title order={1} ta="center" mb="xl">
          Complete Your Subscription
        </Title>
        
        <Stepper active={activeStep} onStepClick={setActiveStep} mb="xl">
          <Stepper.Step label="Review" description="Review your plan">
            {/* Step content will be conditionally rendered below */}
          </Stepper.Step>
          <Stepper.Step label="Payment" description="Enter payment details">
            {/* Step content will be conditionally rendered below */}
          </Stepper.Step>
          <Stepper.Step label="Confirmation" description="Subscription confirmed">
            {/* Step content will be conditionally rendered below */}
          </Stepper.Step>
        </Stepper>
        
        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            mb="md"
          >
            {error.message}
          </Alert>
        )}
        
        {success && (
          <Alert 
            icon={<IconCheck size={16} />} 
            title="Success" 
            color="green" 
            mb="md"
          >
            Your subscription has been successfully processed! You will be redirected to the dashboard shortly.
          </Alert>
        )}
        
        {/* Step 1: Review Plan */}
        {activeStep === 0 && (
          <Grid>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Order Summary</Title>
                
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{plan.name} Plan ({billingCycle})</Text>
                  <Text fw={700}>{getPrice()}</Text>
                </Group>
                
                <Text size="sm" c="dimmed" mb="md">
                  {plan.description}
                </Text>
                
                <Divider my="md" />
                
                <List
                  spacing="sm"
                  size="sm"
                  mb="xl"
                  icon={
                    <ThemeIcon color="teal" size={20} radius="xl">
                      <IconCheck size={rem(12)} />
                    </ThemeIcon>
                  }
                >
                  {plan.features.map((feature, index) => (
                    <List.Item key={index}>{feature}</List.Item>
                  ))}
                </List>
                
                <Divider my="md" />
                
                <Group justify="space-between" mb="xs">
                  <Text fw={700}>Total</Text>
                  <Text fw={700}>{getPrice()}</Text>
                </Group>
                
                <Text size="xs" c="dimmed" mt="sm">
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                  You can cancel your subscription at any time from your account settings.
                </Text>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Stack justify="space-between" h="100%">
                  <div>
                    <Title order={3} mb="md">Next Steps</Title>
                    <Text size="sm">
                      After reviewing your plan, you'll need to enter your payment details to complete your subscription.
                    </Text>
                    <List
                      spacing="sm"
                      size="sm"
                      mt="md"
                      icon={
                        <ThemeIcon color="blue" size={20} radius="xl">
                          <IconCheck size={rem(12)} />
                        </ThemeIcon>
                      }
                    >
                      <List.Item>Secure payment processing</List.Item>
                      <List.Item>14-day trial period</List.Item>
                      <List.Item>Cancel anytime</List.Item>
                      <List.Item>Instant access after payment</List.Item>
                    </List>
                  </div>
                  
                  <Button 
                    fullWidth 
                    onClick={nextStep}
                    mt="auto"
                  >
                    Continue to Payment
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        )}
        
        {/* Step 2: Payment Details */}
        {activeStep === 1 && (
          <Grid>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Payment Details</Title>
                
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack>
                    <TextInput
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      icon={<IconCreditCard size={16} />}
                      required
                      {...form.getInputProps('cardNumber')}
                    />
                    
                    <TextInput
                      label="Name on Card"
                      placeholder="John Doe"
                      required
                      {...form.getInputProps('cardName')}
                    />
                    
                    <Group grow>
                      <TextInput
                        label="Expiry Date"
                        placeholder="MM/YY"
                        required
                        {...form.getInputProps('expiryDate')}
                      />
                      
                      <TextInput
                        label="CVV"
                        placeholder="123"
                        required
                        {...form.getInputProps('cvv')}
                      />
                    </Group>
                    
                    <Select
                      label="Country"
                      placeholder="Select country"
                      data={[
                        { value: 'US', label: 'United States' },
                        { value: 'CA', label: 'Canada' },
                        { value: 'UK', label: 'United Kingdom' },
                        { value: 'AU', label: 'Australia' },
                        { value: 'DE', label: 'Germany' },
                        { value: 'FR', label: 'France' },
                      ]}
                      required
                      {...form.getInputProps('country')}
                    />
                    
                    <TextInput
                      label="Postal Code"
                      placeholder="12345"
                      required
                      {...form.getInputProps('postalCode')}
                    />
                    
                    <Group justify="space-between" mt="md">
                      <Button variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                      
                      <Button 
                        type="submit" 
                        loading={processingPayment || subscriptionLoading}
                      >
                        Complete Purchase
                      </Button>
                    </Group>
                  </Stack>
                </form>
                
                <Text size="xs" c="dimmed" mt="lg" ta="center">
                  Your payment information is securely processed. We do not store your full card details.
                </Text>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Order Summary</Title>
                
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{plan.name} Plan ({billingCycle})</Text>
                  <Text fw={700}>{getPrice()}</Text>
                </Group>
                
                <Divider my="md" />
                
                <Group justify="space-between" mb="xs">
                  <Text fw={700}>Total</Text>
                  <Text fw={700}>{getPrice()}</Text>
                </Group>
                
                <Text size="xs" c="dimmed" mt="sm">
                  You will be charged {getPrice()}. Your subscription will automatically renew at the end of your billing cycle.
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        )}
        
        {/* Step 3: Confirmation */}
        {activeStep === 2 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center" spacing="lg">
              <ThemeIcon size={80} radius={100} color="green">
                <IconCheck size={50} />
              </ThemeIcon>
              
              <Title order={2}>Thank You for Your Subscription!</Title>
              
              <Text ta="center" size="lg">
                Your {plan.name} plan is now active. You will be redirected to the dashboard shortly.
              </Text>
              
              <Button 
                onClick={() => router.push('/dashboard')} 
                size="lg"
                mt="md"
              >
                Go to Dashboard
              </Button>
            </Stack>
          </Card>
        )}
      </Container>
    </AppLayout>
  );
} 