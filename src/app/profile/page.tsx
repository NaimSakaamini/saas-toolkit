'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Container, Title, Text, Card, TextInput, Button, Group, Avatar, Stack, Alert } from '@mantine/core';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { useAuth } from '@/services/auth/AuthProvider';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, userProfile, updateProfile, loading, error, clearError } = useAuth();
  
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormError(null);
    clearError();
    setSuccess(false);
    
    try {
      await updateProfile({
        displayName,
        phoneNumber
      });
      
      setSuccess(true);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while updating your profile');
    }
  };
  
  return (
    <ProtectedRoute>
      <AppLayout>
        <Container size="lg" py="xl">
          <Title order={1} mb="md">Your Profile</Title>
          
          {formError && (
            <Alert 
              color="red" 
              title="Error" 
              mb="md"
              withCloseButton
              onClose={() => setFormError(null)}
            >
              {formError}
            </Alert>
          )}
          
          {success && (
            <Alert 
              color="green" 
              title="Success" 
              mb="md"
              withCloseButton
              onClose={() => setSuccess(false)}
            >
              Your profile has been updated successfully.
            </Alert>
          )}
          
          <Group align="flex-start" grow>
            <Card withBorder p="lg">
              <form onSubmit={handleUpdateProfile}>
                <Stack gap="md">
                  <TextInput
                    label="Display Name"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={loading}
                  />
                  
                  <TextInput
                    label="Email"
                    value={email}
                    disabled
                    description="Email cannot be changed"
                  />
                  
                  <TextInput
                    label="Phone Number"
                    placeholder="Your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loading}
                  />
                  
                  <Button type="submit" loading={loading}>
                    Update Profile
                  </Button>
                </Stack>
              </form>
            </Card>
            
            <Stack>
              <Card withBorder p="lg">
                <Title order={3} mb="md">Account Information</Title>
                
                <Group mb="md">
                  <Avatar 
                    size="xl" 
                    src={user?.photoURL} 
                    alt={userProfile?.displayName || 'User'}
                    color="blue"
                  >
                    {userProfile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </Avatar>
                  
                  <div>
                    <Text fw={500} size="lg">{userProfile?.displayName || 'User'}</Text>
                    <Text size="sm" c="dimmed">{user?.email}</Text>
                  </div>
                </Group>
                
                <Text size="sm">
                  <strong>Account created:</strong> {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}
                </Text>
                
                <Text size="sm">
                  <strong>Last updated:</strong> {userProfile?.updatedAt ? new Date(userProfile.updatedAt).toLocaleDateString() : 'Never'}
                </Text>
              </Card>
              
              <Card withBorder p="lg">
                <Title order={3} mb="md">Security</Title>
                
                <Stack gap="md">
                  <Button component={Link} href="/profile/sessions" variant="outline">
                    Manage Sessions
                  </Button>
                  
                  <Button component={Link} href="/auth/forgot-password" variant="outline">
                    Reset Password
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Group>
        </Container>
      </AppLayout>
    </ProtectedRoute>
  );
} 