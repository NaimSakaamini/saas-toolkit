'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Button, 
  Group, 
  Alert, 
  Loader, 
  Center,
  Stack,
  Badge
} from '@mantine/core';
import { 
  IconCheck, 
  IconX, 
  IconAlertCircle, 
  IconBuildingCommunity 
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useInvitation } from '@/services/invitation/InvitationProvider';
import { useAuth } from '@/services/auth/AuthProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { Invitation } from '@/services/invitation/invitationService';

export default function InvitationPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const { getInvitationByTokenString, acceptInvitationById, declineInvitationById } = useInvitation();
  const { user, loading: authLoading } = useAuth();
  
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Load invitation when the component mounts
  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const inv = await getInvitationByTokenString(params.token);
        
        if (!inv) {
          setError('Invitation not found or has expired');
        } else {
          setInvitation(inv);
        }
      } catch (err) {
        setError('Error loading invitation');
        console.error('Error loading invitation:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInvitation();
  }, [params.token]);
  
  // Handle accepting an invitation
  const handleAccept = async () => {
    if (!invitation || !user) return;
    
    setLoading(true);
    
    try {
      await acceptInvitationById(invitation.id, user.uid);
      setSuccess('You have successfully joined the organization');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Error accepting invitation');
      console.error('Error accepting invitation:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle declining an invitation
  const handleDecline = async () => {
    if (!invitation) return;
    
    setLoading(true);
    
    try {
      await declineInvitationById(invitation.id);
      setSuccess('Invitation declined');
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError('Error declining invitation');
      console.error('Error declining invitation:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Check if the invitation has expired
  const isExpired = (invitation: Invitation) => {
    const expiresAt = typeof invitation.expiresAt === 'string' 
      ? new Date(invitation.expiresAt) 
      : invitation.expiresAt;
    
    return expiresAt < new Date();
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
  
  return (
    <AppLayout>
      <Container size="sm" py="xl">
        <Card withBorder p="xl" radius="md">
          {loading ? (
            <Center p="xl">
              <Loader size="lg" />
            </Center>
          ) : error ? (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Error" 
              color="red"
            >
              {error}
            </Alert>
          ) : success ? (
            <Alert 
              icon={<IconCheck size={16} />} 
              title="Success" 
              color="green"
            >
              {success}
            </Alert>
          ) : invitation ? (
            <Stack>
              <Title order={1} ta="center">
                You've Been Invited
              </Title>
              
              <Text ta="center" c="dimmed" mb="xl">
                {invitation.inviterName || 'Someone'} has invited you to join their organization
              </Text>
              
              <Card withBorder p="md" radius="md">
                <Stack>
                  <Group>
                    <IconBuildingCommunity size={24} />
                    <Title order={3}>{invitation.orgName}</Title>
                  </Group>
                  
                  <Text>
                    <strong>Role:</strong> {invitation.role}
                  </Text>
                  
                  <Text>
                    <strong>Invited by:</strong> {invitation.inviterName || 'Unknown'}
                  </Text>
                  
                  <Text>
                    <strong>Expires:</strong> {formatDate(invitation.expiresAt)}
                    {isExpired(invitation) && (
                      <Badge color="red" ml="xs">Expired</Badge>
                    )}
                  </Text>
                </Stack>
              </Card>
              
              {!isExpired(invitation) && (
                <Group justify="center" mt="xl">
                  <Button 
                    color="red" 
                    onClick={handleDecline}
                    leftSection={<IconX size={16} />}
                    disabled={authLoading}
                  >
                    Decline
                  </Button>
                  
                  <Button 
                    onClick={handleAccept}
                    leftSection={<IconCheck size={16} />}
                    disabled={authLoading}
                  >
                    Accept Invitation
                  </Button>
                </Group>
              )}
              
              {!user && (
                <Alert 
                  icon={<IconAlertCircle size={16} />} 
                  title="Authentication Required" 
                  color="blue"
                  mt="md"
                >
                  You need to sign in or create an account to accept this invitation.
                </Alert>
              )}
            </Stack>
          ) : (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Invitation Not Found" 
              color="red"
            >
              The invitation you're looking for doesn't exist or has expired.
            </Alert>
          )}
        </Card>
      </Container>
    </AppLayout>
  );
} 