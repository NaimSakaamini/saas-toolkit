'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Title, 
  Button, 
  Alert,
  Stack,
  Badge,
  SimpleGrid,
  Modal,
  Divider,
  List,
  ThemeIcon,
  rem
} from '@mantine/core';
import { 
  IconAlertCircle,
  IconCheck,
  IconArrowUp,
  IconArrowDown,
  IconCreditCard
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/services/subscription/SubscriptionProvider';
import { getPricingPlans, PricingPlan } from '@/services/subscription/subscriptionService';

interface SubscriptionManagerProps {
  showTitle?: boolean;
}

export function SubscriptionManager({ showTitle = true }: SubscriptionManagerProps) {
  const router = useRouter();
  const { 
    currentPlan, 
    currentSubscription, 
    updateCurrentSubscription,
    cancelCurrentSubscription,
    loading, 
    error 
  } = useSubscription();
  
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get all pricing plans
  const plans = getPricingPlans();

  // Format date
  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle plan selection
  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  // Handle plan change confirmation
  const handleConfirmPlanChange = async () => {
    if (!selectedPlan) return;
    
    setProcessingAction(true);
    setErrorMessage(null);
    
    try {
      // For simplicity, we're just updating the plan ID
      // In a real implementation, this would involve Stripe API calls
      await updateCurrentSubscription({
        planId: selectedPlan.id,
        // Reset trial status if upgrading
        status: currentSubscription?.status === 'trialing' ? 'active' : currentSubscription?.status
      });
      
      setSuccessMessage(`Successfully changed to ${selectedPlan.name} plan`);
      setModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to change plan');
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
    setProcessingAction(true);
    setErrorMessage(null);
    
    try {
      await cancelCurrentSubscription(cancelAtPeriodEnd);
      
      setCancelModalOpen(false);
      setSuccessMessage(
        cancelAtPeriodEnd 
          ? 'Your subscription will be canceled at the end of the current billing period' 
          : 'Your subscription has been canceled immediately'
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to cancel subscription');
    } finally {
      setProcessingAction(false);
    }
  };

  // Determine if a plan is an upgrade, downgrade, or current
  const getPlanAction = (plan: PricingPlan): 'current' | 'upgrade' | 'downgrade' => {
    if (!currentPlan) return 'upgrade';
    if (plan.id === currentPlan.id) return 'current';
    
    // Simple logic: higher price = upgrade, lower price = downgrade
    return plan.price > currentPlan.price ? 'upgrade' : 'downgrade';
  };

  // Get button text based on plan action
  const getButtonText = (action: 'current' | 'upgrade' | 'downgrade'): string => {
    switch (action) {
      case 'current':
        return 'Current Plan';
      case 'upgrade':
        return 'Upgrade';
      case 'downgrade':
        return 'Downgrade';
    }
  };

  // Get button color based on plan action
  const getButtonColor = (action: 'current' | 'upgrade' | 'downgrade'): string => {
    switch (action) {
      case 'current':
        return 'gray';
      case 'upgrade':
        return 'blue';
      case 'downgrade':
        return 'orange';
    }
  };

  // Get button icon based on plan action
  const getButtonIcon = (action: 'current' | 'upgrade' | 'downgrade') => {
    switch (action) {
      case 'current':
        return null;
      case 'upgrade':
        return <IconArrowUp size={16} />;
      case 'downgrade':
        return <IconArrowDown size={16} />;
    }
  };

  return (
    <>
      <Card withBorder p="md" radius="md">
        {showTitle && (
          <Title order={3} mb="md">Subscription Management</Title>
        )}

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

        {errorMessage && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            mb="md"
            onClose={() => setErrorMessage(null)}
            withCloseButton
          >
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert 
            title="Success" 
            color="green" 
            mb="md"
            onClose={() => setSuccessMessage(null)}
            withCloseButton
          >
            {successMessage}
          </Alert>
        )}

        {loading ? (
          <Text>Loading subscription data...</Text>
        ) : !currentSubscription ? (
          <Stack align="center" py="xl">
            <IconCreditCard size={48} opacity={0.3} />
            <Text c="dimmed" ta="center">
              No active subscription found. Please select a plan to subscribe.
            </Text>
            <Button 
              variant="filled" 
              onClick={() => router.push('/pricing')}
              mt="md"
            >
              View Plans
            </Button>
          </Stack>
        ) : (
          <>
            <Card withBorder p="md" radius="md" mb="lg">
              <Group justify="space-between" mb="xs">
                <div>
                  <Text fw={500} size="lg">Current Plan: {currentPlan?.name}</Text>
                  <Text size="sm" c="dimmed">
                    {currentPlan?.description}
                  </Text>
                </div>
                <Badge 
                  color={currentSubscription.status === 'active' ? 'green' : 
                         currentSubscription.status === 'trialing' ? 'blue' : 
                         currentSubscription.status === 'canceled' ? 'red' : 'orange'}
                  size="lg"
                >
                  {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                </Badge>
              </Group>
              
              <Divider my="sm" />
              
              <Group justify="space-between" mb="xs">
                <Text>Billing Period</Text>
                <Text>
                  {formatDate(currentSubscription.currentPeriodStart)} - {formatDate(currentSubscription.currentPeriodEnd)}
                </Text>
              </Group>
              
              <Group justify="space-between" mb="xs">
                <Text>Price</Text>
                <Text fw={500}>${currentPlan?.price}/month</Text>
              </Group>
              
              {currentSubscription.cancelAtPeriodEnd && (
                <Alert 
                  color="orange" 
                  title="Subscription Ending" 
                  mt="md"
                >
                  Your subscription will end on {formatDate(currentSubscription.currentPeriodEnd)}.
                </Alert>
              )}
              
              <Group mt="lg">
                {!currentSubscription.cancelAtPeriodEnd && (
                  <Button 
                    variant="outline" 
                    color="red" 
                    onClick={() => setCancelModalOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/settings/billing/payment-methods')}
                >
                  Manage Payment Methods
                </Button>
              </Group>
            </Card>
            
            <Title order={4} mb="md">Available Plans</Title>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
              {plans.map((plan) => {
                const action = getPlanAction(plan);
                
                return (
                  <Card key={plan.id} withBorder p="md" radius="md">
                    <Text fw={500} size="lg">{plan.name}</Text>
                    <Text size="xl" fw={700} my="md">
                      ${plan.price}/month
                    </Text>
                    <Text size="sm" c="dimmed" mb="md">
                      {plan.description}
                    </Text>
                    
                    <Button 
                      fullWidth 
                      mt="auto"
                      variant={action === 'current' ? 'outline' : 'filled'}
                      color={getButtonColor(action)}
                      leftSection={getButtonIcon(action)}
                      onClick={() => handleSelectPlan(plan)}
                      disabled={action === 'current'}
                    >
                      {getButtonText(action)}
                    </Button>
                  </Card>
                );
              })}
            </SimpleGrid>
          </>
        )}
      </Card>

      {/* Plan Change Confirmation Modal */}
      <Modal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={`Change to ${selectedPlan?.name} Plan`}
        centered
      >
        {selectedPlan && (
          <Stack>
            <Text>
              You are about to change your subscription from <strong>{currentPlan?.name}</strong> to <strong>{selectedPlan.name}</strong>.
            </Text>
            
            <Group justify="space-between" mb="xs">
              <Text>New Price</Text>
              <Text fw={500}>${selectedPlan.price}/month</Text>
            </Group>
            
            <Divider my="sm" />
            
            <Text fw={500}>Features included:</Text>
            <List
              spacing="sm"
              size="sm"
              center
              icon={
                <ThemeIcon color="teal" size={20} radius="xl">
                  <IconCheck size={rem(12)} />
                </ThemeIcon>
              }
            >
              {selectedPlan.features.map((feature, index) => (
                <List.Item key={index}>{feature}</List.Item>
              ))}
            </List>
            
            <Divider my="sm" />
            
            <Text size="sm" c="dimmed">
              {getPlanAction(selectedPlan) === 'upgrade' 
                ? 'Your card will be charged immediately for the prorated amount.' 
                : 'Your change will take effect at the end of your current billing period.'}
            </Text>
            
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                color={getButtonColor(getPlanAction(selectedPlan))}
                onClick={handleConfirmPlanChange}
                loading={processingAction}
              >
                Confirm Change
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Cancel Subscription Modal */}
      <Modal 
        opened={cancelModalOpen} 
        onClose={() => setCancelModalOpen(false)} 
        title="Cancel Subscription"
        centered
      >
        <Stack>
          <Text>
            Are you sure you want to cancel your {currentPlan?.name} subscription?
          </Text>
          
          <Alert color="yellow">
            <Text fw={500}>What happens when you cancel:</Text>
            <List size="sm" mt="xs">
              <List.Item>You will lose access to premium features</List.Item>
              <List.Item>Your data will be retained for 30 days</List.Item>
              <List.Item>You can resubscribe at any time</List.Item>
            </List>
          </Alert>
          
          <Divider my="sm" />
          
          <Text fw={500}>When would you like to cancel?</Text>
          
          <Group grow>
            <Button 
              variant="outline" 
              color="red"
              onClick={() => handleCancelSubscription(true)}
              loading={processingAction}
            >
              At Period End ({formatDate(currentSubscription?.currentPeriodEnd || new Date())})
            </Button>
            <Button 
              variant="filled" 
              color="red"
              onClick={() => handleCancelSubscription(false)}
              loading={processingAction}
            >
              Immediately
            </Button>
          </Group>
          
          <Button variant="subtle" onClick={() => setCancelModalOpen(false)} mt="xs">
            Keep My Subscription
          </Button>
        </Stack>
      </Modal>
    </>
  );
} 