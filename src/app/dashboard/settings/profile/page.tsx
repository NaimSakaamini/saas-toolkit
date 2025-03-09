'use client';

import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  TextInput, 
  Button, 
  Group, 
  Avatar, 
  Stack, 
  Divider,
  PasswordInput,
  Alert,
  Tabs
} from '@mantine/core';
import { IconUser, IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { useAuth } from '@/services/auth/AuthProvider';

export default function ProfileSettingsPage() {
  const { user, userProfile, updateProfile, updatePassword, error, clearError } = useAuth();
  
  // Profile form state
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [profileSuccess, setProfileSuccess] = useState(false);
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setProfileSuccess(false);
    clearError();
    setProfileLoading(true);
    
    try {
      await updateProfile({
        displayName,
        phoneNumber,
      });
      
      setProfileSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setPasswordSuccess(false);
    setPasswordError(null);
    clearError();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      await updatePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl">
          <Title order={1} mb="sm">Profile Settings</Title>
          <Text c="dimmed" mb="xl">
            Manage your personal information and account settings
          </Text>
          
          <Tabs defaultValue="profile">
            <Tabs.List mb="md">
              <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                Profile Information
              </Tabs.Tab>
              <Tabs.Tab value="password" leftSection={<IconLock size={16} />}>
                Password
              </Tabs.Tab>
            </Tabs.List>
            
            <Tabs.Panel value="profile">
              <Card withBorder p="xl" radius="md">
                <Group mb="xl">
                  <Avatar 
                    src={user?.photoURL} 
                    alt={displayName || 'User'} 
                    size="xl" 
                    radius="xl"
                    color="blue"
                  >
                    {displayName?.charAt(0) || email?.charAt(0) || 'U'}
                  </Avatar>
                  <div>
                    <Text size="lg" fw={500}>{displayName || email}</Text>
                    <Text size="sm" c="dimmed">{email}</Text>
                  </div>
                </Group>
                
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
                
                {profileSuccess && (
                  <Alert 
                    icon={<IconCheck size={16} />} 
                    title="Success" 
                    color="green" 
                    mb="md"
                  >
                    Profile updated successfully
                  </Alert>
                )}
                
                <form onSubmit={handleUpdateProfile}>
                  <Stack>
                    <TextInput
                      label="Display Name"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    
                    <TextInput
                      label="Email"
                      placeholder="Your email"
                      value={email}
                      disabled
                      description="Email cannot be changed"
                    />
                    
                    <TextInput
                      label="Phone Number"
                      placeholder="Your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    
                    <Button 
                      type="submit" 
                      loading={profileLoading}
                      mt="md"
                    >
                      Update Profile
                    </Button>
                  </Stack>
                </form>
              </Card>
            </Tabs.Panel>
            
            <Tabs.Panel value="password">
              <Card withBorder p="xl" radius="md">
                <Title order={3} mb="md">Change Password</Title>
                
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
                
                {passwordError && (
                  <Alert 
                    icon={<IconAlertCircle size={16} />} 
                    title="Error" 
                    color="red" 
                    mb="md"
                  >
                    {passwordError}
                  </Alert>
                )}
                
                {passwordSuccess && (
                  <Alert 
                    icon={<IconCheck size={16} />} 
                    title="Success" 
                    color="green" 
                    mb="md"
                  >
                    Password updated successfully
                  </Alert>
                )}
                
                <form onSubmit={handleUpdatePassword}>
                  <Stack>
                    <PasswordInput
                      label="Current Password"
                      placeholder="Your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    
                    <PasswordInput
                      label="New Password"
                      placeholder="Your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    
                    <PasswordInput
                      label="Confirm New Password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    
                    <Button 
                      type="submit" 
                      loading={passwordLoading}
                      mt="md"
                    >
                      Update Password
                    </Button>
                  </Stack>
                </form>
              </Card>
            </Tabs.Panel>
          </Tabs>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 