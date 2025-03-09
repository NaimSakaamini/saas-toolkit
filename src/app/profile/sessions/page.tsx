'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Container, Title, Text } from '@mantine/core';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { SessionManager } from '@/components/ui/SessionManager';

export default function SessionsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Container size="lg" py="xl">
          <Title order={1} mb="md">Session Management</Title>
          
          <Text mb="xl">
            Manage your active sessions across different devices. You can terminate individual sessions or all other sessions.
          </Text>
          
          <SessionManager />
        </Container>
      </AppLayout>
    </ProtectedRoute>
  );
} 