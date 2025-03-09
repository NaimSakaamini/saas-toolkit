'use client';

import { Container, Title, Text, SimpleGrid, Card, rem } from '@mantine/core';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureShowcaseProps {
  title?: string;
  description?: string;
  features?: Feature[];
}

export function FeatureShowcase({
  title = 'Everything You Need to Build Your SaaS',
  description = 'Naim SaaS Toolkit provides all the essential components and services to build a modern SaaS application quickly and efficiently.',
  features = [],
}: FeatureShowcaseProps) {
  // Default features if none are provided
  const defaultFeatures: Feature[] = [
    {
      title: 'Authentication System',
      description: 'Complete authentication system with email/password, Google sign-in, and session management.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
    },
    {
      title: 'Organization Management',
      description: 'Create and manage organizations with team members, roles, and permissions.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      title: 'Beautiful UI Components',
      description: 'Modern, responsive UI components built with Mantine UI library.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      ),
    },
    {
      title: 'Firebase Integration',
      description: 'Seamless integration with Firebase for authentication, database, and storage.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path>
          <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"></path>
          <path d="M15 2v5h5"></path>
        </svg>
      ),
    },
    {
      title: 'Role-Based Access Control',
      description: 'Granular permission system with role-based access control for your application.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
          <circle cx="12" cy="16" r="1"></circle>
        </svg>
      ),
    },
    {
      title: 'Invitation System',
      description: 'Invite team members to your organization with email invitations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 13V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8"></path>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          <path d="M16 19h6"></path>
          <path d="M19 16v6"></path>
        </svg>
      ),
    },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <>
      <style jsx global>{`
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${rem(60)};
          height: ${rem(60)};
          border-radius: 50%;
          background: var(--mantine-color-blue-0);
          color: var(--mantine-color-blue-6);
          margin-bottom: ${rem(16)};
        }
        
        .dark .feature-icon {
          background: var(--mantine-color-dark-6);
          color: var(--mantine-color-blue-4);
        }
      `}</style>
      
      <Container size="lg" py={80}>
        <Title order={2} ta="center" mb="sm">
          {title}
        </Title>
        
        <Text ta="center" c="dimmed" mb={50} maw={800} mx="auto" size="lg">
          {description}
        </Text>
        
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={30}>
          {displayFeatures.map((feature, index) => (
            <Card key={index} p="xl" radius="md" className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              
              <Text fw={700} size="lg" mt="md" mb="xs">
                {feature.title}
              </Text>
              
              <Text size="sm" c="dimmed">
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
} 