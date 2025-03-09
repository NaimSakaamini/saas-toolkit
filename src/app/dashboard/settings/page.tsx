'use client';

import { Container, Title, Text, SimpleGrid, Card, Group, ThemeIcon } from '@mantine/core';
import { IconUser, IconBell, IconBuildingCommunity } from '@tabler/icons-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function SettingsCard({ title, description, icon, href }: SettingsCardProps) {
  return (
    <Card 
      component={Link} 
      href={href} 
      withBorder 
      padding="lg" 
      radius="md"
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Group>
        <ThemeIcon size="xl" radius="md" variant="light" color="blue">
          {icon}
        </ThemeIcon>
        <div>
          <Title order={3}>{title}</Title>
          <Text c="dimmed" size="sm" mt="xs">
            {description}
          </Text>
        </div>
      </Group>
    </Card>
  );
}

export default function SettingsPage() {
  const settingsCards = [
    {
      title: 'Profile Settings',
      description: 'Manage your personal information, password, and account preferences',
      icon: <IconUser size={24} />,
      href: '/dashboard/settings/profile',
    },
    {
      title: 'Notification Settings',
      description: 'Configure your notification preferences and communication channels',
      icon: <IconBell size={24} />,
      href: '/dashboard/settings/notifications',
    },
    {
      title: 'Organization Settings',
      description: 'Manage your organization details, team members, and permissions',
      icon: <IconBuildingCommunity size={24} />,
      href: '/dashboard/settings/organization',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl">
          <Title order={1} mb="sm">Settings</Title>
          <Text c="dimmed" mb="xl">
            Manage your account settings and preferences
          </Text>
          
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            {settingsCards.map((card, index) => (
              <SettingsCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                href={card.href}
              />
            ))}
          </SimpleGrid>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 