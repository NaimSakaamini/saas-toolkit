'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Title, 
  Table, 
  Badge, 
  Button, 
  ActionIcon, 
  Tooltip,
  Pagination,
  Alert,
  Divider,
  Stack
} from '@mantine/core';
import { 
  IconDownload, 
  IconExternalLink, 
  IconAlertCircle,
  IconReceipt
} from '@tabler/icons-react';
import { useSubscription } from '@/services/subscription/SubscriptionProvider';

interface InvoiceListProps {
  showTitle?: boolean;
  itemsPerPage?: number;
}

export function InvoiceList({ showTitle = true, itemsPerPage = 5 }: InvoiceListProps) {
  const { invoices, loading, error, refreshInvoices } = useSubscription();
  const [activePage, setActivePage] = useState(1);

  // Format date
  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Get badge color based on invoice status
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'open':
        return 'blue';
      case 'draft':
        return 'gray';
      case 'uncollectible':
        return 'orange';
      case 'void':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refreshInvoices();
  };

  // Calculate pagination
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const paginatedInvoices = invoices.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    <Card withBorder p="md" radius="md">
      {showTitle && (
        <Group justify="space-between" mb="md">
          <Title order={3}>Billing History</Title>
          <Button 
            variant="outline" 
            leftSection={<IconReceipt size={16} />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </Group>
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

      {loading ? (
        <Text>Loading invoices...</Text>
      ) : invoices.length === 0 ? (
        <Stack align="center" py="xl">
          <IconReceipt size={48} opacity={0.3} />
          <Text c="dimmed" ta="center">
            No invoices found. Your billing history will appear here once you have been charged.
          </Text>
        </Stack>
      ) : (
        <>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Period</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedInvoices.map((invoice) => (
                <Table.Tr key={invoice.id}>
                  <Table.Td>{formatDate(invoice.createdAt)}</Table.Td>
                  <Table.Td>{formatCurrency(invoice.amount, invoice.currency)}</Table.Td>
                  <Table.Td>
                    <Badge color={getStatusBadgeColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {invoice.invoiceUrl && (
                        <Tooltip label="View Invoice">
                          <ActionIcon 
                            variant="subtle" 
                            component="a" 
                            href={invoice.invoiceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <IconExternalLink size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      {invoice.invoicePdfUrl && (
                        <Tooltip label="Download PDF">
                          <ActionIcon 
                            variant="subtle" 
                            component="a" 
                            href={invoice.invoicePdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <IconDownload size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {totalPages > 1 && (
            <Group justify="center" mt="md">
              <Pagination 
                total={totalPages} 
                value={activePage} 
                onChange={setActivePage} 
              />
            </Group>
          )}
        </>
      )}
    </Card>
  );
} 