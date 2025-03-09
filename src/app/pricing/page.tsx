'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Group, 
  Badge, 
  Button, 
  List, 
  ThemeIcon, 
  SimpleGrid,
  Switch,
  useMantineTheme,
  rem,
  Divider,
  Alert
} from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/services/auth/AuthProvider';
import { useSubscription } from '@/services/subscription/SubscriptionProvider';
import { getPricingPlans } from '@/services/subscription/subscriptionService';
import { AppLayout } from '@/components/layout/AppLayout';

export default function PricingPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const { user, loading: authLoading } = useAuth();
  const { 
    currentPlan, 
    createNewSubscription, 
    loading: subscriptionLoading, 
    error 
  } = useSubscription();
  
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  
  // Get all pricing plans
  const plans = getPricingPlans();
  
  // Handle plan selection
  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/pricing');
      return;
    }
    
    try {
      setProcessingPlanId(planId);
      
      // If it's the free plan, just create the subscription
      if (planId === 'free') {
        await createNewSubscription(planId);
        router.push('/dashboard');
        return;
      }
      
      // For paid plans, redirect to checkout
      router.push(`/checkout?plan=${planId}&billing=${yearlyBilling ? 'yearly' : 'monthly'}`);
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setProcessingPlanId(null);
    }
  };
  
  // Determine button text based on current plan and authentication status
  const getButtonText = (planId: string) => {
    if (!user) return 'Sign up';
    if (currentPlan?.id === planId) return 'Current plan';
    return 'Select plan';
  };
  
  // Calculate price based on billing cycle
  const getPrice = (price: number, planId: string) => {
    if (planId === 'free') return 'Free';
    
    const monthlyPrice = price;
    const yearlyPrice = price * 10; // 2 months free with yearly billing
    
    return yearlyBilling 
      ? `$${yearlyPrice}/year` 
      : `$${monthlyPrice}/month`;
  };
  
  return (
    <AppLayout>
      <Container size="lg" py="xl">
        <Title order={1} ta="center" mt="sm">
          Choose the right plan for your business
        </Title>
        
        <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="sm">
          Start with our free plan or upgrade to unlock premium features. 
          All plans include a 14-day trial period.
        </Text>
        
        <Group justify="center" mt={30}>
          <Text size="sm">Monthly billing</Text>
          <Switch 
            checked={yearlyBilling} 
            onChange={() => setYearlyBilling(!yearlyBilling)} 
            size="md"
          />
          <Group gap={5}>
            <Text size="sm">Annual billing</Text>
            <Badge size="sm" variant="filled" color="green">Save 16%</Badge>
          </Group>
        </Group>
        
        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            mt="md"
          >
            {error.message}
          </Alert>
        )}
        
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt={50}>
          {plans.map((plan) => (
            <Card key={plan.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500} size="lg">{plan.name}</Text>
                {plan.id === 'pro' && (
                  <Badge color="blue" variant="light">
                    Most Popular
                  </Badge>
                )}
              </Group>
              
              <Text size="xl" fw={700} my="md">
                {getPrice(plan.price, plan.id)}
              </Text>
              
              <Text size="sm" c="dimmed" mb="md">
                {plan.description}
              </Text>
              
              <Divider my="sm" />
              
              <List
                spacing="sm"
                size="sm"
                my="md"
                center
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
              
              <Button 
                fullWidth 
                mt="md" 
                radius="md"
                color={plan.id === 'pro' ? 'blue' : undefined}
                variant={plan.id === 'pro' ? 'filled' : 'outline'}
                onClick={() => handleSelectPlan(plan.id)}
                loading={processingPlanId === plan.id || subscriptionLoading}
                disabled={currentPlan?.id === plan.id || authLoading}
              >
                {getButtonText(plan.id)}
              </Button>
            </Card>
          ))}
        </SimpleGrid>
        
        <Text c="dimmed" ta="center" size="sm" mt={50}>
          All plans include a 14-day trial period. No credit card required for the free plan.
          You can upgrade, downgrade, or cancel your subscription at any time.
        </Text>
      </Container>
    </AppLayout>
  );
} 