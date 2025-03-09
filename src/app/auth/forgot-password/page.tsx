'use client';

import { useState } from 'react';
import { Container, Title, Text, Card, TextInput, Button, Anchor, Stack, Alert } from '@mantine/core';
import Link from 'next/link';
import { useAuth } from '@/services/auth/AuthProvider';

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Handle form validation
  const validateForm = () => {
    clearError();
    setFormError(null);
    
    if (!email) {
      setFormError('Email is required');
      return false;
    }
    
    return true;
  };
  
  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      // Firebase error messages are not always user-friendly, so we map them
      if (err.code === 'auth/user-not-found') {
        setFormError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setFormError('Invalid email address');
      } else {
        setFormError(err.message || 'An error occurred while sending the reset link');
      }
    }
  };
  
  return (
    <Container size="xs" py="xl">
      <Title order={1} ta="center" mb="lg">
        Reset Your Password
      </Title>
      
      <Text ta="center" mb="xl">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </Text>
      
      {formError && (
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
          Password reset link has been sent to your email address. Please check your inbox.
        </Alert>
      )}
      
      <Card withBorder shadow="md" p="xl" radius="md">
        <form onSubmit={handleResetPassword}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || success}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              disabled={success}
            >
              Send Reset Link
            </Button>
          </Stack>
        </form>
      </Card>
      
      <Text ta="center" mt="md">
        Remember your password?{' '}
        <Anchor component={Link} href="/auth/login">
          Back to Login
        </Anchor>
      </Text>
    </Container>
  );
} 