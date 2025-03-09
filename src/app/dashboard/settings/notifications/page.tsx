'use client';

import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Switch, 
  Group, 
  Stack, 
  Divider, 
  Button,
  Alert,
  SegmentedControl,
  Paper,
  Checkbox,
  Select
} from '@mantine/core';
import { IconBell, IconCheck, IconMail, IconDeviceMobile, IconBrowser } from '@tabler/icons-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';

interface NotificationChannel {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  channels: Record<string, boolean>;
}

export default function NotificationSettingsPage() {
  const channels: NotificationChannel[] = [
    { id: 'email', label: 'Email', icon: <IconMail size={16} /> },
    { id: 'push', label: 'Push', icon: <IconBrowser size={16} /> },
    { id: 'sms', label: 'SMS', icon: <IconDeviceMobile size={16} /> },
  ];
  
  const [notificationCategories, setNotificationCategories] = useState<NotificationCategory[]>([
    {
      id: 'account',
      title: 'Account Notifications',
      description: 'Updates about your account, security, and privacy',
      enabled: true,
      channels: { email: true, push: true, sms: false },
    },
    {
      id: 'team',
      title: 'Team Notifications',
      description: 'Updates about team members, invitations, and role changes',
      enabled: true,
      channels: { email: true, push: true, sms: false },
    },
    {
      id: 'projects',
      title: 'Project Notifications',
      description: 'Updates about projects, tasks, and deadlines',
      enabled: true,
      channels: { email: true, push: false, sms: false },
    },
    {
      id: 'billing',
      title: 'Billing Notifications',
      description: 'Updates about billing, invoices, and subscription changes',
      enabled: true,
      channels: { email: true, push: false, sms: true },
    },
    {
      id: 'marketing',
      title: 'Marketing Notifications',
      description: 'Updates about new features, promotions, and events',
      enabled: false,
      channels: { email: false, push: false, sms: false },
    },
  ]);
  
  const [digestFrequency, setDigestFrequency] = useState('daily');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const toggleCategory = (categoryId: string) => {
    setNotificationCategories(categories => 
      categories.map(category => 
        category.id === categoryId 
          ? { ...category, enabled: !category.enabled } 
          : category
      )
    );
  };
  
  const toggleChannel = (categoryId: string, channelId: string) => {
    setNotificationCategories(categories => 
      categories.map(category => 
        category.id === categoryId 
          ? { 
              ...category, 
              channels: { 
                ...category.channels, 
                [channelId]: !category.channels[channelId] 
              } 
            } 
          : category
      )
    );
  };
  
  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl">
          <Title order={1} mb="sm">Notification Settings</Title>
          <Text c="dimmed" mb="xl">
            Configure how and when you receive notifications
          </Text>
          
          {success && (
            <Alert 
              icon={<IconCheck size={16} />} 
              title="Success" 
              color="green" 
              mb="xl"
            >
              Notification settings saved successfully
            </Alert>
          )}
          
          <Card withBorder p="xl" radius="md" mb="xl">
            <Title order={3} mb="md">Notification Digest</Title>
            <Text c="dimmed" mb="lg">
              Choose how often you want to receive notification digests
            </Text>
            
            <Select
              label="Digest Frequency"
              value={digestFrequency}
              onChange={(value) => setDigestFrequency(value || 'daily')}
              data={[
                { value: 'realtime', label: 'Real-time (Immediate)' },
                { value: 'daily', label: 'Daily Digest' },
                { value: 'weekly', label: 'Weekly Digest' },
                { value: 'never', label: 'Never (Disable Digests)' },
              ]}
              mb="md"
            />
            
            <Checkbox
              label="Include low priority notifications in digest"
              defaultChecked
              mb="md"
            />
          </Card>
          
          <Card withBorder p="xl" radius="md">
            <Title order={3} mb="md">Notification Preferences</Title>
            <Text c="dimmed" mb="lg">
              Configure which notifications you receive and how you receive them
            </Text>
            
            <Group mb="md">
              <Text fw={500}>Channels:</Text>
              {channels.map(channel => (
                <Group key={channel.id} gap="xs">
                  {channel.icon}
                  <Text size="sm">{channel.label}</Text>
                </Group>
              ))}
            </Group>
            
            <Divider mb="md" />
            
            <Stack>
              {notificationCategories.map((category) => (
                <Paper key={category.id} withBorder p="md" radius="sm">
                  <Group justify="space-between" mb="xs">
                    <div>
                      <Text fw={500}>{category.title}</Text>
                      <Text size="sm" c="dimmed">{category.description}</Text>
                    </div>
                    <Switch
                      checked={category.enabled}
                      onChange={() => toggleCategory(category.id)}
                      size="md"
                    />
                  </Group>
                  
                  {category.enabled && (
                    <Group mt="md">
                      {channels.map(channel => (
                        <Checkbox
                          key={channel.id}
                          label={
                            <Group gap="xs">
                              {channel.icon}
                              <Text size="sm">{channel.label}</Text>
                            </Group>
                          }
                          checked={category.channels[channel.id]}
                          onChange={() => toggleChannel(category.id, channel.id)}
                        />
                      ))}
                    </Group>
                  )}
                </Paper>
              ))}
            </Stack>
            
            <Button 
              mt="xl" 
              onClick={handleSaveSettings}
              loading={loading}
              leftSection={<IconBell size={16} />}
            >
              Save Notification Settings
            </Button>
          </Card>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 