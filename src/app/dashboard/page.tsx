'use client';

import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  SimpleGrid, 
  Paper, 
  Group, 
  ThemeIcon, 
  RingProgress, 
  Stack,
  Button,
  Card
} from '@mantine/core';
import { 
  IconUsers, 
  IconBuildingStore, 
  IconChartBar, 
  IconClock, 
  IconArrowUpRight, 
  IconArrowDownRight 
} from '@tabler/icons-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { SubscriptionWidget } from '@/components/dashboard/SubscriptionWidget';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  diff: number;
}

function StatsCard({ title, value, description, icon, diff }: StatsCardProps) {
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;
  const diffColor = diff > 0 ? 'teal' : 'red';

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            {title}
          </Text>
          <Title order={2} fw={700} mt="xs">
            {value}
          </Title>
          <Text size="xs" c="dimmed" mt={7}>
            {description}
          </Text>
        </div>
        <ThemeIcon
          color="gray"
          variant="light"
          size={48}
          radius="xl"
        >
          {icon}
        </ThemeIcon>
      </Group>
      <Group mt="xs">
        <Text c={diffColor} fw={700} size="sm">
          {diff > 0 ? '+' : ''}{diff}%
        </Text>
        <DiffIcon size={16} color={diffColor} />
        <Text size="xs" c="dimmed">
          compared to previous month
        </Text>
      </Group>
    </Paper>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl">
          <Title order={1} mb="lg">Dashboard</Title>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
            <StatsCard
              title="Team Members"
              value="12"
              description="Total team members"
              icon={<IconUsers size={24} />}
              diff={12}
            />
            <StatsCard
              title="Projects"
              value="8"
              description="Active projects"
              icon={<IconBuildingStore size={24} />}
              diff={-2}
            />
            <StatsCard
              title="Usage"
              value="64%"
              description="Storage capacity used"
              icon={<IconChartBar size={24} />}
              diff={8}
            />
            <StatsCard
              title="Uptime"
              value="99.9%"
              description="System availability"
              icon={<IconClock size={24} />}
              diff={0.2}
            />
          </SimpleGrid>
          
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <Card withBorder p="xl" radius="md">
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group justify="space-between">
                  <Text fw={700}>Resource Usage</Text>
                  <Button variant="light" size="xs">View Details</Button>
                </Group>
              </Card.Section>
              
              <SimpleGrid cols={3}>
                <Stack align="center">
                  <RingProgress
                    size={80}
                    thickness={8}
                    sections={[{ value: 64, color: 'blue' }]}
                    label={
                      <Text size="xs" ta="center" fw={700}>
                        64%
                      </Text>
                    }
                  />
                  <Text size="sm">Storage</Text>
                </Stack>
                
                <Stack align="center">
                  <RingProgress
                    size={80}
                    thickness={8}
                    sections={[{ value: 48, color: 'teal' }]}
                    label={
                      <Text size="xs" ta="center" fw={700}>
                        48%
                      </Text>
                    }
                  />
                  <Text size="sm">Bandwidth</Text>
                </Stack>
                
                <Stack align="center">
                  <RingProgress
                    size={80}
                    thickness={8}
                    sections={[{ value: 87, color: 'orange' }]}
                    label={
                      <Text size="xs" ta="center" fw={700}>
                        87%
                      </Text>
                    }
                  />
                  <Text size="sm">API Calls</Text>
                </Stack>
              </SimpleGrid>
            </Card>
            
            <Card withBorder p="xl" radius="md">
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group justify="space-between">
                  <Text fw={700}>Recent Activity</Text>
                  <Button variant="light" size="xs">View All</Button>
                </Group>
              </Card.Section>
              
              <Stack gap="xs">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon color="blue" variant="light" size="md">
                      <IconUsers size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm">New team member added</Text>
                      <Text size="xs" c="dimmed">John Doe joined the team</Text>
                    </div>
                  </Group>
                  <Text size="xs" c="dimmed">2 hours ago</Text>
                </Group>
                
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon color="green" variant="light" size="md">
                      <IconBuildingStore size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm">Project created</Text>
                      <Text size="xs" c="dimmed">New project "Website Redesign" created</Text>
                    </div>
                  </Group>
                  <Text size="xs" c="dimmed">5 hours ago</Text>
                </Group>
                
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon color="orange" variant="light" size="md">
                      <IconChartBar size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm">Usage limit reached</Text>
                      <Text size="xs" c="dimmed">API calls limit reached 85%</Text>
                    </div>
                  </Group>
                  <Text size="xs" c="dimmed">1 day ago</Text>
                </Group>
              </Stack>
            </Card>
            
            <SubscriptionWidget />
          </SimpleGrid>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 