'use client';

import { useState } from 'react';
import { 
  Card, 
  TextInput, 
  Textarea, 
  Button, 
  Stack, 
  Title, 
  Text, 
  ColorInput,
  Alert
} from '@mantine/core';
import { IconCheck, IconBuildingCommunity } from '@tabler/icons-react';
import { useOrganization } from '@/services/organization/OrganizationProvider';

interface CreateOrganizationFormProps {
  onSuccess?: (orgId: string) => void;
}

export function CreateOrganizationForm({ onSuccess }: CreateOrganizationFormProps) {
  const { createNewOrganization, loading, error } = useOrganization();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3498db');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      const orgId = await createNewOrganization({
        name,
        description,
        primaryColor
      });
      
      setSuccess(true);
      setName('');
      setDescription('');
      setPrimaryColor('#3498db');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(orgId);
      }
    } catch (err) {
      console.error('Error creating organization:', err);
    }
  };
  
  return (
    <Card withBorder p="xl" radius="md">
      <Title order={2} mb="md">Create New Organization</Title>
      <Text c="dimmed" mb="xl">
        Create a new organization to collaborate with your team
      </Text>
      
      {success && (
        <Alert 
          icon={<IconCheck size={16} />} 
          title="Success" 
          color="green" 
          mb="xl"
        >
          Organization created successfully
        </Alert>
      )}
      
      {error && (
        <Alert 
          title="Error" 
          color="red" 
          mb="xl"
        >
          {error.message}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Organization Name"
            placeholder="Enter organization name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <Textarea
            label="Description"
            placeholder="Enter organization description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
          />
          
          <ColorInput
            label="Primary Color"
            placeholder="Choose brand color"
            value={primaryColor}
            onChange={setPrimaryColor}
            format="hex"
            swatches={['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']}
          />
          
          <Button 
            type="submit" 
            loading={loading}
            mt="md"
            leftSection={<IconBuildingCommunity size={16} />}
          >
            Create Organization
          </Button>
        </Stack>
      </form>
    </Card>
  );
} 