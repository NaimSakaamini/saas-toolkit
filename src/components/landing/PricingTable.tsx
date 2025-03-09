'use client';

import { useState } from 'react';
import { Container, Title, Text, Card, Group, Badge, Button, Switch, SimpleGrid, List, ThemeIcon, rem } from '@mantine/core';
import Link from 'next/link';

interface PricingFeature {
  text: string;
  available: boolean;
}

interface PricingPlan {
  title: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: PricingFeature[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
  badge?: string;
}

interface PricingTableProps {
  title?: string;
  description?: string;
  plans?: PricingPlan[];
}

export function PricingTable({
  title = 'Simple, Transparent Pricing',
  description = 'Choose the plan that fits your needs. All plans include a 14-day free trial.',
  plans = [],
}: PricingTableProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  
  // Default pricing plans if none are provided
  const defaultPlans: PricingPlan[] = [
    {
      title: 'Starter',
      price: {
        monthly: 0,
        yearly: 0,
      },
      description: 'Perfect for individuals and small projects',
      features: [
        { text: 'Up to 3 team members', available: true },
        { text: 'Basic authentication', available: true },
        { text: 'Organization management', available: true },
        { text: 'Role-based access control', available: false },
        { text: 'Invitation system', available: false },
        { text: 'Priority support', available: false },
      ],
      buttonText: 'Get Started',
      buttonLink: '/auth/register',
    },
    {
      title: 'Pro',
      price: {
        monthly: 29,
        yearly: 290,
      },
      description: 'For growing teams and businesses',
      features: [
        { text: 'Up to 10 team members', available: true },
        { text: 'Advanced authentication', available: true },
        { text: 'Organization management', available: true },
        { text: 'Role-based access control', available: true },
        { text: 'Invitation system', available: true },
        { text: 'Priority support', available: false },
      ],
      buttonText: 'Get Started',
      buttonLink: '/auth/register',
      highlighted: true,
      badge: 'Popular',
    },
    {
      title: 'Enterprise',
      price: {
        monthly: 99,
        yearly: 990,
      },
      description: 'For large organizations with advanced needs',
      features: [
        { text: 'Unlimited team members', available: true },
        { text: 'Advanced authentication', available: true },
        { text: 'Organization management', available: true },
        { text: 'Role-based access control', available: true },
        { text: 'Invitation system', available: true },
        { text: 'Priority support', available: true },
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/contact',
    },
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <>
      <style jsx global>{`
        .pricing-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .pricing-card.highlighted {
          border: 2px solid var(--mantine-color-blue-5);
          transform: scale(1.05);
          position: relative;
          z-index: 1;
        }
        
        .pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .pricing-card.highlighted:hover {
          transform: translateY(-5px) scale(1.05);
        }
        
        .pricing-features {
          flex-grow: 1;
          margin-bottom: ${rem(24)};
        }
        
        .pricing-badge {
          position: absolute;
          top: ${rem(-10)};
          right: ${rem(10)};
          z-index: 2;
        }
      `}</style>
      
      <Container size="lg" py={80}>
        <Title order={2} ta="center" mb="sm">
          {title}
        </Title>
        
        <Text ta="center" c="dimmed" mb={50} maw={800} mx="auto" size="lg">
          {description}
        </Text>
        
        <Group justify="center" mb={50}>
          <Text size="sm" fw={500}>Monthly</Text>
          <Switch
            checked={billingInterval === 'yearly'}
            onChange={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
            size="md"
          />
          <Group gap={5}>
            <Text size="sm" fw={500}>Yearly</Text>
            <Badge variant="filled" color="green" size="sm">Save 20%</Badge>
          </Group>
        </Group>
        
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={30}>
          {displayPlans.map((plan, index) => (
            <Card 
              key={index} 
              p="xl" 
              radius="md" 
              className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
              pos="relative"
            >
              {plan.badge && (
                <Badge className="pricing-badge" variant="filled" color="blue">
                  {plan.badge}
                </Badge>
              )}
              
              <Title order={3} ta="center">
                {plan.title}
              </Title>
              
              <Text ta="center" c="dimmed" mb="md" size="sm">
                {plan.description}
              </Text>
              
              <Group ta="center" justify="center" mb="md">
                <Text size="xl" span fw={700}>
                  $
                </Text>
                <Text size="4rem" span fw={700} lh={1}>
                  {billingInterval === 'monthly' ? plan.price.monthly : plan.price.yearly}
                </Text>
                <Text size="sm" span c="dimmed">
                  / {billingInterval}
                </Text>
              </Group>
              
              <List
                spacing="sm"
                size="sm"
                center
                className="pricing-features"
              >
                {plan.features.map((feature, featureIndex) => (
                  <List.Item
                    key={featureIndex}
                    icon={
                      <ThemeIcon 
                        color={feature.available ? 'teal' : 'gray'} 
                        size={20} 
                        radius="xl"
                      >
                        {feature.available ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        )}
                      </ThemeIcon>
                    }
                    c={feature.available ? undefined : 'dimmed'}
                  >
                    {feature.text}
                  </List.Item>
                ))}
              </List>
              
              <Button
                component={Link}
                href={plan.buttonLink}
                fullWidth
                variant={plan.highlighted ? 'gradient' : 'outline'}
                gradient={plan.highlighted ? { from: 'blue', to: 'cyan' } : undefined}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
} 