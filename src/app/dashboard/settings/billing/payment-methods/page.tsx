'use client';

import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Button
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { PaymentMethodManager } from '@/components/subscription/PaymentMethodManager';

export default function PaymentMethodsPage() {
  const router = useRouter();
  
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl">
          <Stack mb="xl">
            <Button 
              variant="subtle" 
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.push('/dashboard/settings/billing')}
              style={{ alignSelf: 'flex-start' }}
            >
              Back to Billing
            </Button>
            
            <Title order={1}>Payment Methods</Title>
            <Text c="dimmed">
              Manage your payment methods for subscription billing.
            </Text>
          </Stack>

          <PaymentMethodManager />
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 