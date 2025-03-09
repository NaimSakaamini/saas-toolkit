'use client';

import { useState } from 'react';
import { 
  Menu, 
  Button, 
  Text, 
  Group, 
  Avatar, 
  Divider,
  Loader,
  UnstyledButton
} from '@mantine/core';
import { IconChevronDown, IconPlus, IconBuildingCommunity } from '@tabler/icons-react';
import { useOrganization } from '@/services/organization/OrganizationProvider';
import Link from 'next/link';

export function OrganizationSelector() {
  const { 
    organizations, 
    currentOrganization, 
    setCurrentOrganization, 
    loading 
  } = useOrganization();
  
  const [menuOpened, setMenuOpened] = useState(false);
  
  const handleOrganizationChange = async (orgId: string) => {
    try {
      await setCurrentOrganization(orgId);
      setMenuOpened(false);
    } catch (error) {
      console.error('Error changing organization:', error);
    }
  };
  
  if (loading) {
    return (
      <Button variant="subtle" disabled>
        <Loader size="xs" mr="xs" /> Loading...
      </Button>
    );
  }
  
  if (!currentOrganization) {
    return (
      <Button 
        component={Link} 
        href="/dashboard/organizations/new"
        variant="light"
        leftSection={<IconPlus size={16} />}
      >
        Create Organization
      </Button>
    );
  }
  
  return (
    <Menu 
      position="bottom-start" 
      width={220}
      opened={menuOpened}
      onChange={setMenuOpened}
    >
      <Menu.Target>
        <UnstyledButton 
          onClick={() => setMenuOpened((o) => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'var(--mantine-color-gray-0)',
            },
          }}
        >
          <Group gap="xs">
            <Avatar 
              size="sm" 
              color="blue" 
              radius="xl"
            >
              {currentOrganization.name.charAt(0)}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500} truncate>
                {currentOrganization.name}
              </Text>
            </div>
            <IconChevronDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      
      <Menu.Dropdown>
        <Menu.Label>Your Organizations</Menu.Label>
        
        {organizations.map((org) => (
          <Menu.Item
            key={org.id}
            leftSection={
              <Avatar size="xs" color="blue" radius="xl">
                {org.name.charAt(0)}
              </Avatar>
            }
            onClick={() => handleOrganizationChange(org.id)}
            style={{
              fontWeight: org.id === currentOrganization.id ? 'bold' : 'normal',
            }}
          >
            {org.name}
          </Menu.Item>
        ))}
        
        <Divider my="xs" />
        
        <Menu.Item
          component={Link}
          href="/dashboard/organizations/new"
          leftSection={<IconPlus size={16} />}
        >
          Create New Organization
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
} 