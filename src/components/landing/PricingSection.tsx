'use client';

import { Container, Title, Text, SimpleGrid, Card, Button, List, ThemeIcon, Group, Badge, Stack } from '@mantine/core';
import Link from 'next/link';

const pricingData = [
  {
    title: 'Free',
    price: '$0',
    description: 'Perfect for individuals and small teams',
    features: [
      { text: '3 Organizations', included: true },
      { text: '5 Team Members', included: true },
      { text: '1GB Storage', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Email Support', included: false },
      { text: 'Custom Branding', included: false },
      { text: 'Advanced Security', included: false },
    ],
    buttonText: 'Get Started',
    buttonLink: '/auth/register',
    popular: false,
  },
  {
    title: 'Pro',
    price: '$29',
    description: 'For growing teams and businesses',
    features: [
      { text: 'Unlimited Organizations', included: true },
      { text: '20 Team Members', included: true },
      { text: '10GB Storage', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'Priority Email Support', included: true },
      { text: 'Custom Branding', included: true },
      { text: 'Advanced Security', included: false },
    ],
    buttonText: 'Upgrade to Pro',
    buttonLink: '/auth/register',
    popular: true,
  },
  {
    title: 'Enterprise',
    price: '$99',
    description: 'For large organizations with advanced needs',
    features: [
      { text: 'Unlimited Organizations', included: true },
      { text: 'Unlimited Team Members', included: true },
      { text: '100GB Storage', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: '24/7 Phone Support', included: true },
      { text: 'Custom Branding', included: true },
      { text: 'Advanced Security', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonLink: '/contact',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <Container size="lg" py="xl">
      <Stack align="center" mb={50}>
        <Title order={1} ta="center">
          Simple, Transparent Pricing
        </Title>
        <Text size="lg" ta="center" maw={600} mx="auto">
          Choose the plan that works best for your team. All plans include a 14-day free trial.
        </Text>
      </Stack>
      
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {pricingData.map((plan) => (
          <Card 
            key={plan.title} 
            withBorder 
            padding="xl" 
            radius="md"
            style={{ 
              borderColor: plan.popular ? 'var(--mantine-color-blue-6)' : undefined,
              transform: plan.popular ? 'scale(1.05)' : undefined,
            }}
          >
            {plan.popular && (
              <Badge color="blue" style={{ position: 'absolute', top: 10, right: 10 }}>
                Most Popular
              </Badge>
            )}
            
            <Stack gap="md">
              <Title order={3}>{plan.title}</Title>
              <Group align="baseline" gap={5}>
                <Text size="xl" fw={700}>{plan.price}</Text>
                <Text size="sm" c="dimmed">per month</Text>
              </Group>
              <Text size="sm" c="dimmed">{plan.description}</Text>
              
              <List spacing="sm" center mt="md" mb="xl">
                {plan.features.map((feature, index) => (
                  <List.Item
                    key={index}
                    icon={
                      <ThemeIcon color={feature.included ? 'green' : 'red'} size={24} radius="xl">
                        {feature.included ? '✓' : '✗'}
                      </ThemeIcon>
                    }
                  >
                    <Text size="sm">{feature.text}</Text>
                  </List.Item>
                ))}
              </List>
              
              <Button 
                component={Link}
                href={plan.buttonLink}
                fullWidth 
                variant={plan.popular ? 'filled' : 'outline'}
              >
                {plan.buttonText}
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
} 