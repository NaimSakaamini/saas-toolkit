'use client';

import React from 'react';
import { 
  Card, 
  Text, 
  Group, 
  RingProgress, 
  Stack, 
  Title, 
  Progress, 
  Badge, 
  Tooltip,
  SimpleGrid
} from '@mantine/core';
import { 
  IconUsers, 
  IconBuildingStore, 
  IconDatabase, 
  IconAlertCircle 
} from '@tabler/icons-react';
import { useSubscription } from '@/services/subscription/SubscriptionProvider';

interface UsageDisplayProps {
  showTitle?: boolean;
  compact?: boolean;
}

export function UsageDisplay({ showTitle = true, compact = false }: UsageDisplayProps) {
  const { 
    currentPlan, 
    currentSubscription, 
    usage, 
    loading, 
    error 
  } = useSubscription();

  // If there's no plan or subscription, show a message
  if (!currentPlan && !loading) {
    return (
      <Card withBorder p="md" radius="md">
        <Text c="dimmed">No active subscription. Please select a plan to view usage metrics.</Text>
      </Card>
    );
  }

  // Calculate usage percentages
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

  // Format storage size
  const formatStorage = (sizeInGB: number): string => {
    if (sizeInGB < 1) {
      return `${Math.round(sizeInGB * 1024)} MB`;
    }
    return `${sizeInGB.toFixed(1)} GB`;
  };

  // Usage metrics to display
  const usageMetrics = [
    {
      name: 'Organizations',
      key: 'organizations',
      icon: <IconBuildingStore size={24} />,
      current: usage.organizations || 0,
      limit: currentPlan?.limits.organizations || 0,
      format: (value: number) => value.toString()
    },
    {
      name: 'Team Members',
      key: 'membersPerOrg',
      icon: <IconUsers size={24} />,
      current: usage.members || 0,
      limit: currentPlan?.limits.membersPerOrg || 0,
      format: (value: number) => value.toString()
    },
    {
      name: 'Storage',
      key: 'storage',
      icon: <IconDatabase size={24} />,
      current: usage.storage || 0,
      limit: currentPlan?.limits.storage || 0,
      format: formatStorage
    }
  ];

  return (
    <Card withBorder p="md" radius="md">
      {showTitle && (
        <Title order={3} mb="md">
          Usage & Quotas
          {currentPlan && (
            <Badge ml="xs" color="blue">{currentPlan.name} Plan</Badge>
          )}
        </Title>
      )}

      {error && (
        <Group mb="md">
          <IconAlertCircle color="red" />
          <Text c="red">Error loading usage data. Please try again later.</Text>
        </Group>
      )}

      {loading ? (
        <Text>Loading usage data...</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: compact ? 1 : 3 }} spacing="lg">
          {usageMetrics.map((metric) => {
            const percentage = getUsagePercentage(metric.key);
            const color = getUsageColor(percentage);
            
            return (
              <Card key={metric.key} withBorder p="md" radius="md">
                <Group>
                  {metric.icon}
                  <div>
                    <Text fw={500}>{metric.name}</Text>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        {metric.format(metric.current)} / {metric.format(metric.limit)}
                      </Text>
                      {percentage >= 80 && (
                        <Tooltip label="Approaching limit">
                          <IconAlertCircle size={16} color={color} />
                        </Tooltip>
                      )}
                    </Group>
                  </div>
                </Group>
                
                <Progress 
                  value={percentage} 
                  color={color} 
                  size="md" 
                  mt="md" 
                  striped={percentage >= 80}
                  animated={percentage >= 90}
                />
              </Card>
            );
          })}
        </SimpleGrid>
      )}
      
      {currentSubscription && currentSubscription.status === 'trialing' && (
        <Text size="sm" c="dimmed" mt="md">
          You are currently in a trial period. Your trial will end on{' '}
          {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}.
        </Text>
      )}
    </Card>
  );
} 