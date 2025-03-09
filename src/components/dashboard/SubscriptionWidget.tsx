'use client';

import React from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Button, 
  Badge, 
  Progress,
  Stack,
  Divider
} from '@mantine/core';
import { 
  IconArrowUpRight, 
  IconCreditCard, 
  IconUsers, 
  IconDatabase 
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/services/subscription/SubscriptionProvider';

export function SubscriptionWidget() {
  const router = useRouter();
  const { 
    currentPlan, 
    currentSubscription, 
    usage, 
    loading, 
    error 
  } = useSubscription();

  // Format date
  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days remaining in subscription
  const getDaysRemaining = (): number => {
    if (!currentSubscription) return 0;
    
    const endDate = new Date(currentSubscription.currentPeriodEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate usage percentage
  const getUsagePercentage = (metric: string): number => {
    if (!currentPlan || !usage[metric]) return 0;
    
    const limit = currentPlan.limits[metric] || 0;
    if (limit === 0) return 0; // Avoid division by zero
    
    const usageValue = usage[metric] || 0;
    return Math.min(Math.round((usageValue / limit) * 100), 100);
  };

  // Get color based on usage percentage
  const getUsageColor = (percentage: number): string => {
    if (percentage < 60) return 'green';
    if (percentage < 80) return 'yellow';
    return 'red';
  };

  if (loading) {
    return (
      <Card withBorder p="md" radius="md">
        <Text>Loading subscription data...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card withBorder p="md" radius="md">
        <Text c="red">Error loading subscription data. Please try again later.</Text>
      </Card>
    );
  }

  if (!currentSubscription || !currentPlan) {
    return (
      <Card withBorder p="md" radius="md">
        <Stack align="center" py="sm">
          <IconCreditCard size={32} opacity={0.5} />
          <Text ta="center" fw={500}>No Active Subscription</Text>
          <Text size="sm" c="dimmed" ta="center">
            Subscribe to a plan to access premium features.
          </Text>
          <Button 
            variant="filled" 
            onClick={() => router.push('/pricing')}
            mt="sm"
          >
            View Plans
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder p="md" radius="md">
      <Group justify="space-between" mb="xs">
        <Text fw={500}>Subscription</Text>
        <Badge 
          color={currentSubscription.status === 'active' ? 'green' : 
                 currentSubscription.status === 'trialing' ? 'blue' : 
                 currentSubscription.status === 'canceled' ? 'red' : 'orange'}
        >
          {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
        </Badge>
      </Group>
      
      <Text size="sm" c="dimmed" mb="md">
        {currentPlan.name} Plan - ${currentPlan.price}/month
      </Text>
      
      <Divider my="sm" />
      
      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm">Billing Period</Text>
          <Text size="sm" fw={500}>
            {formatDate(currentSubscription.currentPeriodStart)} - {formatDate(currentSubscription.currentPeriodEnd)}
          </Text>
        </Group>
        
        <Group justify="space-between">
          <Text size="sm">Days Remaining</Text>
          <Text size="sm" fw={500}>{getDaysRemaining()} days</Text>
        </Group>
      </Stack>
      
      <Divider my="sm" />
      
      <Text size="sm" fw={500} mb="xs">Usage</Text>
      
      <Stack gap="xs">
        <div>
          <Group justify="space-between" mb={5}>
            <Group gap="xs">
              <IconUsers size={16} />
              <Text size="xs">Team Members</Text>
            </Group>
            <Text size="xs">
              {usage.members || 0}/{currentPlan.limits.membersPerOrg || 0}
            </Text>
          </Group>
          <Progress 
            value={getUsagePercentage('membersPerOrg')} 
            color={getUsageColor(getUsagePercentage('membersPerOrg'))} 
            size="xs" 
          />
        </div>
        
        <div>
          <Group justify="space-between" mb={5}>
            <Group gap="xs">
              <IconDatabase size={16} />
              <Text size="xs">Storage</Text>
            </Group>
            <Text size="xs">
              {usage.storage || 0} GB/{currentPlan.limits.storage || 0} GB
            </Text>
          </Group>
          <Progress 
            value={getUsagePercentage('storage')} 
            color={getUsageColor(getUsagePercentage('storage'))} 
            size="xs" 
          />
        </div>
      </Stack>
      
      <Button 
        variant="light" 
        fullWidth 
        mt="md"
        rightSection={<IconArrowUpRight size={16} />}
        onClick={() => router.push('/dashboard/settings/billing')}
      >
        Manage Subscription
      </Button>
    </Card>
  );
} 