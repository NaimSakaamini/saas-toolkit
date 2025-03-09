'use client';

import { useState } from 'react';
import { 
  TextInput, 
  Button, 
  Group, 
  Select, 
  Card, 
  Text, 
  Alert,
  Stack
} from '@mantine/core';
import { IconMail, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useInvitation } from '@/services/invitation/InvitationProvider';
import { InvitationServiceCallbacks } from '@/services/invitation/invitationService';

interface InviteUserFormProps {
  showTitle?: boolean;
  onSuccess?: (email: string) => void;
}

export function InviteUserForm({ showTitle = true, onSuccess }: InviteUserFormProps) {
  const { createNewInvitation, loading, error } = useInvitation();
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    try {
      // Define callbacks
      const callbacks: InvitationServiceCallbacks = {
        onInvitationCreated: (invitation) => {
          console.log('Invitation created:', invitation);
          // In a real app, you would send an email here
        }
      };
      
      // Create the invitation
      await createNewInvitation(
        {
          email,
          role
        },
        callbacks
      );
      
      // Show success message
      setSuccess(true);
      
      // Clear form
      setEmail('');
      setRole('member');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(email);
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };
  
  return (
    <Card withBorder p="xl" radius="md">
      {showTitle && (
        <Text fw={700} size="lg" mb="md">
          Invite Team Member
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
      
      {success && (
        <Alert 
          icon={<IconCheck size={16} />} 
          title="Success" 
          color="green" 
          mb="xl"
        >
          Invitation sent to {email}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Email Address"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          
          <Select
            label="Role"
            value={role}
            onChange={(value) => setRole(value as 'admin' | 'member')}
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'member', label: 'Member' }
            ]}
          />
          
          <Button 
            type="submit" 
            loading={loading}
            leftSection={<IconMail size={16} />}
            mt="md"
          >
            Send Invitation
          </Button>
        </Stack>
      </form>
    </Card>
  );
} 