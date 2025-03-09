'use client';

import { useState } from 'react';
import { Container, Title, Text, Card, TextInput, PasswordInput, Button, Group, Divider, Anchor, Stack, Alert } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/services/auth/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, loading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  
  // Handle form validation
  const validateForm = () => {
    clearError();
    setFormError(null);
    
    if (!email) {
      setFormError('Email is required');
      return false;
    }
    
    if (!password) {
      setFormError('Password is required');
      return false;
    }
    
    return true;
  };
  
  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await signInWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      // Firebase error messages are not always user-friendly, so we map them
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setFormError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setFormError('Too many failed login attempts. Please try again later.');
      } else {
        setFormError(err.message || 'An error occurred during login');
      }
    }
  };
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'An error occurred during Google login');
    }
  };
  
  return (
    <Container size="xs" py="xl">
      <Title order={1} ta="center" mb="lg">
        Welcome Back
      </Title>
      
      {(formError || error) && (
        <Alert 
          color="red" 
          title="Error" 
          mb="md"
          withCloseButton
          onClose={() => {
            setFormError(null);
            clearError();
          }}
        >
          {formError || error?.message}
        </Alert>
      )}
      
      <Card withBorder shadow="md" p="xl" radius="md">
        <form onSubmit={handleEmailLogin}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            
            <Group justify="space-between" mt="md">
              <Anchor component={Link} href="/auth/forgot-password" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            
            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
            
            <Divider label="Or continue with" labelPosition="center" />
            
            <Button 
              variant="outline" 
              fullWidth 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Google
            </Button>
          </Stack>
        </form>
      </Card>
      
      <Text ta="center" mt="md">
        Don&apos;t have an account?{' '}
        <Anchor component={Link} href="/auth/register">
          Register
        </Anchor>
      </Text>
    </Container>
  );
} 