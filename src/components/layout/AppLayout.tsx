'use client';

import React, { ReactNode, useState } from 'react';
import { AppShell, Burger, Text, Group, Box, NavLink, Button } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/services/auth/AuthProvider';
import { useTheme } from '@/components/ui/ThemeProvider';

interface AppLayoutProps {
  children: ReactNode;
}

const navigationLinks = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Pricing', path: '/pricing' },
];

const profileLinks = [
  { label: 'Profile', path: '/profile' },
  { label: 'Sessions', path: '/profile/sessions' },
];

const authLinks = [
  { label: 'Login', path: '/auth/login' },
  { label: 'Register', path: '/auth/register' },
];

/**
 * Main application layout component
 * 
 * Provides a consistent layout with header, navbar, and footer.
 */
export function AppLayout({ children }: AppLayoutProps) {
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { colorScheme } = useTheme();
  
  // Check if user is on an auth page
  const isAuthPage = pathname?.startsWith('/auth');
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      footer={{ height: 60 }}
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
              Naim SaaS Toolkit
            </Text>
          </Group>
          
          <Group gap="xs" visibleFrom="sm">
            {isAuthPage ? (
              navigationLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  href={link.path}
                  variant="subtle"
                >
                  {link.label}
                </Button>
              ))
            ) : (
              <>
                {navigationLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={Link}
                    href={link.path}
                    variant={pathname === link.path ? 'light' : 'subtle'}
                  >
                    {link.label}
                  </Button>
                ))}
                
                {user ? (
                  <>
                    <Button component={Link} href="/profile" variant="outline">Profile</Button>
                    <Button onClick={handleSignOut}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button component={Link} href="/auth/login" variant="outline">Login</Button>
                    <Button component={Link} href="/auth/register">Register</Button>
                  </>
                )}
              </>
            )}
          </Group>
        </Group>
      </AppShell.Header>
      
      <AppShell.Navbar p="md">
        <Text fw={700} mb="md">Navigation</Text>
        {navigationLinks.map((link) => (
          <NavLink
            key={link.path}
            label={link.label}
            component={Link}
            href={link.path}
            active={pathname === link.path}
          />
        ))}
        
        {user && (
          <>
            <Text fw={700} mt="xl" mb="md">Profile</Text>
            {profileLinks.map((link) => (
              <NavLink
                key={link.path}
                label={link.label}
                component={Link}
                href={link.path}
                active={pathname === link.path}
              />
            ))}
          </>
        )}
        
        <Text fw={700} mt="xl" mb="md">Authentication</Text>
        {user ? (
          <NavLink
            label="Logout"
            onClick={handleSignOut}
          />
        ) : (
          authLinks.map((link) => (
            <NavLink
              key={link.path}
              label={link.label}
              component={Link}
              href={link.path}
              active={pathname === link.path}
            />
          ))
        )}
      </AppShell.Navbar>
      
      <AppShell.Main>
        {children}
      </AppShell.Main>
      
      <AppShell.Footer p="md">
        <Text ta="center" size="sm">
          © {new Date().getFullYear()} Naim SaaS Toolkit. All rights reserved.
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
} 