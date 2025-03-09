'use client';

import { Container, Title, Text, Button, Group, Paper, Stack, Box } from '@mantine/core';
import Link from 'next/link';

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
  backgroundGradient?: boolean;
}

export function CallToAction({
  title = 'Ready to Build Your SaaS?',
  description = 'Get started with Naim SaaS Toolkit today and launch your SaaS application in record time.',
  primaryButtonText = 'Get Started',
  secondaryButtonText = 'Learn More',
  primaryButtonLink = '/auth/register',
  secondaryButtonLink = '/docs',
  backgroundGradient = true,
}: CallToActionProps) {
  return (
    <Box py={80}>
      <Container size="lg">
        <Paper
          p={40}
          radius="lg"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: backgroundGradient 
              ? 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-9) 100%)' 
              : undefined,
          }}
        >
          {/* Background pattern */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              pointerEvents: 'none',
            }}
          />

          <Stack align="center" gap="lg">
            <Title order={2} ta="center" c={backgroundGradient ? 'white' : undefined}>
              {title}
            </Title>
            
            <Text 
              ta="center" 
              maw={600} 
              mx="auto" 
              size="lg"
              c={backgroundGradient ? 'white' : 'dimmed'}
            >
              {description}
            </Text>
            
            <Group mt="lg">
              <Button 
                component={Link}
                href={primaryButtonLink}
                size="lg" 
                variant={backgroundGradient ? 'white' : 'filled'}
                color={backgroundGradient ? 'dark' : 'blue'}
              >
                {primaryButtonText}
              </Button>
              
              <Button 
                component={Link}
                href={secondaryButtonLink}
                size="lg" 
                variant={backgroundGradient ? 'outline' : 'light'}
                color={backgroundGradient ? 'white' : 'blue'}
              >
                {secondaryButtonText}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
} 