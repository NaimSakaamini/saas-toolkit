'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  AppShell, 
  Burger, 
  Group, 
  UnstyledButton, 
  Stack, 
  Text, 
  ThemeIcon, 
  rem, 
  Box,
  ScrollArea,
  Avatar,
  Menu,
  Divider,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconDashboard, 
  IconSettings, 
  IconUsers, 
  IconBuildingStore, 
  IconChevronRight,
  IconBell,
  IconUser,
  IconLogout,
  IconMoon,
  IconSun,
  IconChevronLeft,
  IconMail
} from '@tabler/icons-react';
import { useAuth } from '@/services/auth/AuthProvider';
import { useTheme } from '@/components/ui/ThemeProvider';
import { OrganizationSelector } from '@/components/organization/OrganizationSelector';

interface NavbarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?(): void;
  href: string;
  collapsed: boolean;
}

function NavbarLink({ icon, label, active, onClick, href, collapsed }: NavbarLinkProps) {
  return (
    <Tooltip 
      label={label} 
      position="right" 
      disabled={!collapsed}
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        component={Link}
        href={href}
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: collapsed ? '0.5rem' : '0.5rem 0.75rem',
          borderRadius: '0.25rem',
          color: active ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-gray-7)',
          backgroundColor: active ? 'var(--mantine-color-blue-0)' : 'transparent',
        }}
      >
        <ThemeIcon 
          variant={active ? 'light' : 'subtle'} 
          color={active ? 'blue' : 'gray'} 
          size={collapsed ? 'lg' : 'md'}
        >
          {icon}
        </ThemeIcon>
        
        {!collapsed && (
          <Box ml="md">
            <Text size="sm" fw={500}>
              {label}
            </Text>
          </Box>
        )}
      </UnstyledButton>
    </Tooltip>
  );
}

interface NavbarNestedLinkProps {
  icon: React.ReactNode;
  label: string;
  links: { label: string; href: string }[];
  active?: boolean;
  collapsed: boolean;
}

function NavbarNestedLink({ icon, label, links, active, collapsed }: NavbarNestedLinkProps) {
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();
  const hasActiveLink = links.some(link => pathname === link.href);
  const shouldShow = opened || hasActiveLink;

  if (collapsed) {
    return (
      <Menu position="right" offset={12} withArrow>
        <Menu.Target>
          <Tooltip 
            label={label} 
            position="right" 
            transitionProps={{ duration: 0 }}
          >
            <UnstyledButton
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                color: hasActiveLink ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-gray-7)',
                backgroundColor: hasActiveLink ? 'var(--mantine-color-blue-0)' : 'transparent',
              }}
            >
              <ThemeIcon 
                variant={hasActiveLink ? 'light' : 'subtle'} 
                color={hasActiveLink ? 'blue' : 'gray'} 
                size="lg"
              >
                {icon}
              </ThemeIcon>
            </UnstyledButton>
          </Tooltip>
        </Menu.Target>
        
        <Menu.Dropdown>
          <Menu.Label>{label}</Menu.Label>
          {links.map((link) => (
            <Menu.Item
              key={link.label}
              component={Link}
              href={link.href}
            >
              {link.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened(!opened)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.25rem',
          color: hasActiveLink ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-gray-7)',
          backgroundColor: hasActiveLink ? 'var(--mantine-color-blue-0)' : 'transparent',
        }}
      >
        <Group justify="space-between" w="100%">
          <Group>
            <ThemeIcon 
              variant={hasActiveLink ? 'light' : 'subtle'} 
              color={hasActiveLink ? 'blue' : 'gray'} 
              size="md"
            >
              {icon}
            </ThemeIcon>
            <Text size="sm" fw={500}>
              {label}
            </Text>
          </Group>
          <IconChevronRight
            size={16}
            style={{
              transform: shouldShow ? 'rotate(90deg)' : 'none',
              transition: 'transform 200ms ease',
            }}
          />
        </Group>
      </UnstyledButton>

      {shouldShow && (
        <Stack gap="xs" pl={36} mt={5}>
          {links.map((link) => (
            <UnstyledButton
              key={link.label}
              component={Link}
              href={link.href}
              style={{
                display: 'block',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                color: pathname === link.href ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-gray-7)',
                backgroundColor: pathname === link.href ? 'var(--mantine-color-blue-0)' : 'transparent',
              }}
            >
              <Text size="sm">{link.label}</Text>
            </UnstyledButton>
          ))}
        </Stack>
      )}
    </>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [opened, setOpened] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { colorScheme, toggleColorScheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Initialize state after component mounts
  useEffect(() => {
    setIsMounted(true);
    
    // Load collapsed state from localStorage on mount
    try {
      const savedCollapsed = localStorage.getItem('sidebar-collapsed');
      if (savedCollapsed !== null) {
        setCollapsed(savedCollapsed === 'true');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Handle sidebar collapse toggle
  const handleToggleCollapse = () => {
    if (!isMounted) return;
    
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    
    try {
      localStorage.setItem('sidebar-collapsed', String(newCollapsed));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const mainLinks = [
    { icon: <IconDashboard size={18} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <IconUsers size={18} />, label: 'Team', href: '/dashboard/team' },
    { icon: <IconMail size={18} />, label: 'Invitations', href: '/dashboard/invitations' },
    { icon: <IconBuildingStore size={18} />, label: 'Projects', href: '/dashboard/projects' },
  ];

  const settingsLinks = [
    { label: 'Profile Settings', href: '/dashboard/settings/profile' },
    { label: 'Notifications', href: '/dashboard/settings/notifications' },
    { label: 'Organization', href: '/dashboard/settings/organization' },
    { label: 'Billing & Subscription', href: '/dashboard/settings/billing' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: collapsed ? 80 : 260, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700} size="lg" component={Link} href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              {collapsed ? 'NST' : 'Naim SaaS Toolkit'}
            </Text>
            
            <OrganizationSelector />
          </Group>
          
          <Group>
            <ActionIcon variant="subtle" aria-label="Notifications">
              <IconBell size={20} />
            </ActionIcon>
            
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <UnstyledButton>
                  <Avatar 
                    src={user?.photoURL} 
                    alt={user?.displayName || 'User'} 
                    radius="xl" 
                    size="sm"
                    color="blue"
                  >
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </Avatar>
                </UnstyledButton>
              </Menu.Target>
              
              <Menu.Dropdown>
                <Menu.Label>
                  {user?.displayName || user?.email}
                </Menu.Label>
                
                <Menu.Item 
                  leftSection={<IconUser size={14} />}
                  component={Link}
                  href="/dashboard/settings/profile"
                >
                  Profile
                </Menu.Item>
                
                <Menu.Item 
                  leftSection={<IconSettings size={14} />}
                  component={Link}
                  href="/dashboard/settings"
                >
                  Settings
                </Menu.Item>
                
                <Divider />
                
                <Menu.Item 
                  leftSection={<IconLogout size={14} />}
                  onClick={() => signOut()}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      
      <AppShell.Navbar p="xs">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Stack gap="xs">
              {mainLinks.map((link) => (
                <NavbarLink
                  key={link.label}
                  {...link}
                  active={pathname === link.href}
                  collapsed={collapsed}
                />
              ))}
              
              <NavbarNestedLink
                icon={<IconSettings size={18} />}
                label="Settings"
                links={settingsLinks}
                active={pathname?.includes('/dashboard/settings')}
                collapsed={collapsed}
              />
            </Stack>
          </div>
          
          <div>
            <Divider my="sm" />
            <Group justify="space-between" px="xs">
              <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"} position="right">
                <ActionIcon 
                  variant="filled" 
                  color="blue"
                  onClick={handleToggleCollapse}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  size="lg"
                  radius="md"
                  style={{ 
                    position: 'relative',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {collapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`} position="right">
                <ActionIcon 
                  variant="filled"
                  color="blue"
                  onClick={toggleColorScheme}
                  aria-label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}
                  size="lg"
                  radius="md"
                >
                  {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
        </div>
      </AppShell.Navbar>
      
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 