'use client';

import { useState } from 'react';
import { Container, Title, Text, Card, TextInput, PasswordInput, Button, Group, Divider, Anchor, Stack, Checkbox, Alert } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/services/auth/AuthProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, loading, error, clearError } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Handle form validation
  const validateForm = () => {
    clearError();
    setFormError(null);
    
    if (!name) {
      setFormError('Name is required');
      return false;
    }
    
    if (!email) {
      setFormError('Email is required');
      return false;
    }
    
    if (!password) {
      setFormError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    
    if (!termsAccepted) {
      setFormError('You must accept the terms and conditions');
      return false;
    }
    
    return true;
  };
  
  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await signUp(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      // Firebase error messages are not always user-friendly, so we map them
      if (err.code === 'auth/email-already-in-use') {
        setFormError('Email is already in use');
      } else if (err.code === 'auth/invalid-email') {
        setFormError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setFormError('Password is too weak');
      } else {
        setFormError(err.message || 'An error occurred during registration');
      }
    }
  };
  
  // Handle Google registration
  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'An error occurred during Google registration');
    }
  };
  
  return (
    <Container size="xs" py="xl">
      <Title order={1} ta="center" mb="lg">
        Create an Account
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
        <form onSubmit={handleRegister}>
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            
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
            
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            
            <Checkbox
              label="I agree to the terms and conditions"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
              required
              disabled={loading}
            />
            
            <Button type="submit" fullWidth loading={loading}>
              Create Account
            </Button>
            
            <Divider label="Or continue with" labelPosition="center" />
            
            <Button 
              variant="outline" 
              fullWidth 
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              Google
            </Button>
          </Stack>
        </form>
      </Card>
      
      <Text ta="center" mt="md">
        Already have an account?{' '}
        <Anchor component={Link} href="/auth/login">
          Login
        </Anchor>
      </Text>
    </Container>
  );
} 