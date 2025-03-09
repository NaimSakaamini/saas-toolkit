'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  Badge, 
  ActionIcon, 
  Group, 
  Text, 
  Button, 
  Menu, 
  Tooltip,
  Alert,
  Card,
  LoadingOverlay
} from '@mantine/core';
import { 
  IconDotsVertical, 
  IconMail, 
  IconTrash, 
  IconCheck, 
  IconX,
  IconAlertCircle
} from '@tabler/icons-react';
import { useInvitation } from '@/services/invitation/InvitationProvider';
import { Invitation } from '@/services/invitation/invitationService';

interface InvitationListProps {
  showTitle?: boolean;
}

export function InvitationList({ showTitle = true }: InvitationListProps) {
  const { 
    invitations, 
    loading, 
    error, 
    cancelInvitationById, 
    resendInvitationById, 
    refreshInvitations 
  } = useInvitation();
  
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  
  // Refresh invitations when the component mounts
  useEffect(() => {
    refreshInvitations();
  }, []);
  
  // Handle resending an invitation
  const handleResend = async (invitationId: string, email: string) => {
    try {
      await resendInvitationById(invitationId);
      setResendSuccess(email);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error resending invitation:', error);
    }
  };
  
  // Handle canceling an invitation
  const handleCancel = async (invitationId: string, email: string) => {
    try {
      await cancelInvitationById(invitationId);
      setCancelSuccess(email);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setCancelSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error canceling invitation:', error);
    }
  };
  
  // Format date
  const formatDate = (date: Date | string) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'accepted':
        return 'green';
      case 'declined':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  // Check if an invitation has expired
  const isExpired = (invitation: Invitation) => {
    const expiresAt = typeof invitation.expiresAt === 'string' 
      ? new Date(invitation.expiresAt) 
      : invitation.expiresAt;
    
    return expiresAt < new Date();
  };
  
  return (
    <Card withBorder p="xl" radius="md" style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      
      {showTitle && (
        <Text fw={700} size="lg" mb="md">
          Pending Invitations
        </Text>
      )}
      
      {error && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error" 
          color="red" 
          mb="xl"
        >
          {error.message}
        </Alert>
      )}
      
      {resendSuccess && (
        <Alert 
          icon={<IconCheck size={16} />} 
          title="Success" 
          color="green" 
          mb="xl"
        >
          Invitation resent to {resendSuccess}
        </Alert>
      )}
      
      {cancelSuccess && (
        <Alert 
          icon={<IconCheck size={16} />} 
          title="Success" 
          color="green" 
          mb="xl"
        >
          Invitation to {cancelSuccess} has been canceled
        </Alert>
      )}
      
      {invitations.length === 0 ? (
        <Text c="dimmed">No pending invitations</Text>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Sent</Table.Th>
              <Table.Th>Expires</Table.Th>
              <Table.Th style={{ width: 80 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {invitations.map((invitation) => (
              <Table.Tr key={invitation.id}>
                <Table.Td>{invitation.email}</Table.Td>
                <Table.Td style={{ textTransform: 'capitalize' }}>{invitation.role}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusBadgeColor(invitation.status)}>
                    {invitation.status}
                  </Badge>
                </Table.Td>
                <Table.Td>{formatDate(invitation.createdAt)}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    {formatDate(invitation.expiresAt)}
                    {isExpired(invitation) && (
                      <Badge color="red" size="xs">Expired</Badge>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>
                  {invitation.status === 'pending' && (
                    <Menu position="bottom-end" withArrow>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconMail size={14} />}
                          onClick={() => handleResend(invitation.id, invitation.email)}
                        >
                          Resend Invitation
                        </Menu.Item>
                        
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => handleCancel(invitation.id, invitation.email)}
                        >
                          Cancel Invitation
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Card>
  );
} 