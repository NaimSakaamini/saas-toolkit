'use client';

import { useState } from 'react';
import { Container, Title, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { CreateOrganizationForm } from '@/components/organization/CreateOrganizationForm';

export default function NewOrganizationPage() {
  const router = useRouter();
  
  const handleSuccess = (orgId: string) => {
    // Redirect to the organization settings page after successful creation
    setTimeout(() => {
      router.push(`/dashboard/settings/organization`);
    }, 1000);
  };
  
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="md" py="xl">
          <Title order={1} mb="sm">Create New Organization</Title>
          <Text c="dimmed" mb="xl">
            Set up a new organization to collaborate with your team
          </Text>
          
          <CreateOrganizationForm onSuccess={handleSuccess} />
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 