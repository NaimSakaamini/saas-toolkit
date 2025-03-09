'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  TextInput, 
  Button, 
  Group, 
  Stack, 
  Divider, 
  Tabs,
  Avatar,
  Table,
  Menu,
  ActionIcon,
  Badge,
  Alert,
  ColorInput,
  FileInput,
  Textarea,
  Select,
  LoadingOverlay
} from '@mantine/core';
import { 
  IconBuildingCommunity, 
  IconUsers, 
  IconSettings, 
  IconTrash, 
  IconEdit, 
  IconDotsVertical,
  IconCheck,
  IconAlertCircle,
  IconUpload,
  IconMail,
  IconPlus
} from '@tabler/icons-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { useOrganization } from '@/services/organization/OrganizationProvider';
import { OrganizationMember } from '@/services/organization/organizationService';
import { useAuth } from '@/services/auth/AuthProvider';
import { CreateOrganizationForm } from '@/components/organization/CreateOrganizationForm';
import { InviteUserForm } from '@/components/invitation/InviteUserForm';
import { InvitationList } from '@/components/invitation/InvitationList';

export default function OrganizationSettingsPage() {
  const { 
    currentOrganization, 
    updateOrgDetails, 
    addMember, 
    removeMember, 
    changeRole, 
    loading, 
    error,
    refreshOrganizations
  } = useOrganization();
  const { user } = useAuth();
  
  // Organization details state
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3498db');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [orgSuccess, setOrgSuccess] = useState(false);
  const [orgLoading, setOrgLoading] = useState(false);
  
  // Invitation state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  
  // Load organization data when currentOrganization changes
  useEffect(() => {
    if (currentOrganization) {
      setOrgName(currentOrganization.name || '');
      setOrgDescription(currentOrganization.description || '');
      setPrimaryColor(currentOrganization.primaryColor || '#3498db');
    }
  }, [currentOrganization]);
  
  const handleUpdateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOrganization) return;
    
    setOrgSuccess(false);
    setOrgLoading(true);
    
    try {
      await updateOrgDetails(currentOrganization.id, {
        name: orgName,
        description: orgDescription,
        primaryColor: primaryColor
      });
      
      setOrgSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setOrgSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating organization:', error);
    } finally {
      setOrgLoading(false);
    }
  };
  
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOrganization || !inviteEmail) return;
    
    setInviteSuccess(false);
    setInviteLoading(true);
    
    try {
      // In a real implementation, you would:
      // 1. Check if the user exists
      // 2. If they do, add them to the organization
      // 3. If they don't, send an invitation email
      
      // For now, we'll simulate success
      setInviteSuccess(true);
      setInviteEmail('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setInviteSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error inviting user:', error);
    } finally {
      setInviteLoading(false);
    }
  };
  
  const handleChangeRole = async (memberId: string, newRole: 'owner' | 'admin' | 'member') => {
    if (!currentOrganization) return;
    
    try {
      await changeRole(currentOrganization.id, memberId, newRole);
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };
  
  const handleRemoveMember = async (memberId: string) => {
    if (!currentOrganization) return;
    
    try {
      await removeMember(currentOrganization.id, memberId);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };
  
  const formatDate = (date: Date | string) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'blue';
      case 'admin':
        return 'green';
      default:
        return 'gray';
    }
  };
  
  // Check if the current user is the owner
  const isOwner = currentOrganization?.members.some(
    member => member.userId === user?.uid && member.role === 'owner'
  );

  // Handle successful organization creation
  const handleCreateOrgSuccess = async (orgId: string) => {
    // Refresh organizations to show the newly created one
    await refreshOrganizations();
  };

  // Handle successful invitation
  const handleInviteSuccess = (email: string) => {
    // Show success message
    setInviteSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setInviteSuccess(false);
    }, 3000);
  };

  if (!currentOrganization) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Container size="lg" py="xl">
            <Title order={1} mb="sm">Organization Settings</Title>
            <Text c="dimmed" mb="xl">
              You don't have an organization yet. Create one to get started.
            </Text>
            
            <CreateOrganizationForm onSuccess={handleCreateOrgSuccess} />
          </Container>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl" style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          
          <Title order={1} mb="sm">Organization Settings</Title>
          <Text c="dimmed" mb="xl">
            Manage your organization details and team members
          </Text>
          
          <Tabs defaultValue="details">
            <Tabs.List mb="md">
              <Tabs.Tab value="details" leftSection={<IconBuildingCommunity size={16} />}>
                Organization Details
              </Tabs.Tab>
              <Tabs.Tab value="team" leftSection={<IconUsers size={16} />}>
                Team Members
              </Tabs.Tab>
              <Tabs.Tab value="invitations" leftSection={<IconMail size={16} />}>
                Invitations
              </Tabs.Tab>
              {isOwner && (
                <Tabs.Tab value="create" leftSection={<IconPlus size={16} />}>
                  Create New Organization
                </Tabs.Tab>
              )}
            </Tabs.List>
            
            <Tabs.Panel value="details">
              <Card withBorder p="xl" radius="md">
                {orgSuccess && (
                  <Alert 
                    icon={<IconCheck size={16} />} 
                    title="Success" 
                    color="green" 
                    mb="xl"
                  >
                    Organization details updated successfully
                  </Alert>
                )}
                
                <form onSubmit={handleUpdateOrganization}>
                  <Stack>
                    <TextInput
                      label="Organization Name"
                      placeholder="Enter organization name"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                      disabled={!isOwner}
                    />
                    
                    <Textarea
                      label="Description"
                      placeholder="Enter organization description"
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                      minRows={3}
                      disabled={!isOwner}
                    />
                    
                    <FileInput
                      label="Organization Logo"
                      placeholder="Upload logo"
                      accept="image/png,image/jpeg,image/svg+xml"
                      value={logoFile}
                      onChange={setLogoFile}
                      leftSection={<IconUpload size={16} />}
                      disabled={!isOwner}
                    />
                    
                    <ColorInput
                      label="Primary Color"
                      placeholder="Choose brand color"
                      value={primaryColor}
                      onChange={setPrimaryColor}
                      format="hex"
                      swatches={['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']}
                      disabled={!isOwner}
                    />
                    
                    {isOwner && (
                      <Button 
                        type="submit" 
                        loading={orgLoading}
                        mt="md"
                        leftSection={<IconSettings size={16} />}
                      >
                        Update Organization
                      </Button>
                    )}
                  </Stack>
                </form>
              </Card>
            </Tabs.Panel>
            
            <Tabs.Panel value="team">
              <Card withBorder p="xl" radius="md">
                {isOwner && (
                  <>
                    <Title order={3} mb="md">Invite Team Members</Title>
                    
                    {inviteSuccess && (
                      <Alert 
                        icon={<IconCheck size={16} />} 
                        title="Success" 
                        color="green" 
                        mb="xl"
                      >
                        Invitation sent successfully
                      </Alert>
                    )}
                    
                    <InviteUserForm showTitle={false} onSuccess={handleInviteSuccess} />
                    
                    <Divider my="lg" />
                  </>
                )}
                
                <Title order={3} mb="md">Team Members</Title>
                
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th>Role</Table.Th>
                      <Table.Th>Joined</Table.Th>
                      {isOwner && <Table.Th style={{ width: 80 }}>Actions</Table.Th>}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentOrganization.members.map((member) => (
                      <Table.Tr key={member.userId}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar size="sm" color="blue">
                              {member.name?.charAt(0) || member.email?.charAt(0) || 'U'}
                            </Avatar>
                            <Text>{member.name || 'Unknown User'}</Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>{member.email || 'No email'}</Table.Td>
                        <Table.Td>
                          <Badge color={getRoleBadgeColor(member.role)}>
                            {member.role}
                          </Badge>
                        </Table.Td>
                        <Table.Td>{formatDate(member.joinedAt)}</Table.Td>
                        {isOwner && (
                          <Table.Td>
                            <Menu position="bottom-end" withArrow>
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <IconDotsVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              
                              <Menu.Dropdown>
                                {member.role !== 'owner' && (
                                  <>
                                    <Menu.Label>Change Role</Menu.Label>
                                    {member.role !== 'admin' && (
                                      <Menu.Item
                                        leftSection={<IconEdit size={14} />}
                                        onClick={() => handleChangeRole(member.userId, 'admin')}
                                      >
                                        Make Admin
                                      </Menu.Item>
                                    )}
                                    {member.role !== 'member' && (
                                      <Menu.Item
                                        leftSection={<IconEdit size={14} />}
                                        onClick={() => handleChangeRole(member.userId, 'member')}
                                      >
                                        Make Member
                                      </Menu.Item>
                                    )}
                                    <Menu.Item
                                      leftSection={<IconEdit size={14} />}
                                      onClick={() => handleChangeRole(member.userId, 'owner')}
                                    >
                                      Transfer Ownership
                                    </Menu.Item>
                                    
                                    <Divider />
                                  </>
                                )}
                                
                                {member.role !== 'owner' && (
                                  <Menu.Item
                                    color="red"
                                    leftSection={<IconTrash size={14} />}
                                    onClick={() => handleRemoveMember(member.userId)}
                                  >
                                    Remove from Organization
                                  </Menu.Item>
                                )}
                              </Menu.Dropdown>
                            </Menu>
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Tabs.Panel>
            
            <Tabs.Panel value="invitations">
              <InvitationList />
            </Tabs.Panel>
            
            {isOwner && (
              <Tabs.Panel value="create">
                <CreateOrganizationForm onSuccess={handleCreateOrgSuccess} />
              </Tabs.Panel>
            )}
          </Tabs>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 