'use client';

import { Container, Title, Text, Grid, Tabs } from '@mantine/core';
import { IconMail, IconList } from '@tabler/icons-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { InviteUserForm } from '@/components/invitation/InviteUserForm';
import { InvitationList } from '@/components/invitation/InvitationList';

export default function InvitationsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl">
          <Title order={1} mb="sm">Invitations</Title>
          <Text c="dimmed" mb="xl">
            Manage team invitations for your organization
          </Text>
          
          <Tabs defaultValue="list">
            <Tabs.List mb="md">
              <Tabs.Tab value="list" leftSection={<IconList size={16} />}>
                Pending Invitations
              </Tabs.Tab>
              <Tabs.Tab value="invite" leftSection={<IconMail size={16} />}>
                Invite New Member
              </Tabs.Tab>
            </Tabs.List>
            
            <Tabs.Panel value="list">
              <InvitationList showTitle={false} />
            </Tabs.Panel>
            
            <Tabs.Panel value="invite">
              <InviteUserForm showTitle={false} />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 