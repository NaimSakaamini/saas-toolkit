'use client';

import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Tabs, 
  Stack,
  Divider
} from '@mantine/core';
import { 
  IconCreditCard, 
  IconReceipt, 
  IconChartBar, 
  IconSettings 
} from '@tabler/icons-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';
import { PaymentMethodManager } from '@/components/subscription/PaymentMethodManager';
import { InvoiceList } from '@/components/subscription/InvoiceList';
import { UsageDisplay } from '@/components/subscription/UsageDisplay';

export default function BillingSettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl">
          <Stack mb="xl">
            <Title order={1}>Billing & Subscription</Title>
            <Text c="dimmed">
              Manage your subscription, payment methods, and view your billing history.
            </Text>
          </Stack>

          <Tabs defaultValue="subscription">
            <Tabs.List mb="md">
              <Tabs.Tab value="subscription" leftSection={<IconSettings size={16} />}>
                Subscription
              </Tabs.Tab>
              <Tabs.Tab value="payment-methods" leftSection={<IconCreditCard size={16} />}>
                Payment Methods
              </Tabs.Tab>
              <Tabs.Tab value="invoices" leftSection={<IconReceipt size={16} />}>
                Billing History
              </Tabs.Tab>
              <Tabs.Tab value="usage" leftSection={<IconChartBar size={16} />}>
                Usage & Quotas
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="subscription">
              <SubscriptionManager />
            </Tabs.Panel>

            <Tabs.Panel value="payment-methods">
              <PaymentMethodManager />
            </Tabs.Panel>

            <Tabs.Panel value="invoices">
              <InvoiceList />
            </Tabs.Panel>

            <Tabs.Panel value="usage">
              <UsageDisplay />
            </Tabs.Panel>
          </Tabs>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 