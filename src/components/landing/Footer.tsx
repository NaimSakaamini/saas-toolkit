'use client';

import { Container, Group, ActionIcon, Text, Anchor, Divider, Stack, SimpleGrid, Box } from '@mantine/core';
import Link from 'next/link';
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin, IconBrandDiscord } from '@tabler/icons-react';

interface FooterLink {
  label: string;
  link: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  columns?: FooterColumn[];
  logo?: React.ReactNode;
  copyright?: string;
}

export function Footer({
  columns = [],
  logo = <Text fw={700} size="lg">Naim SaaS Toolkit</Text>,
  copyright = `© ${new Date().getFullYear()} Naim SaaS Toolkit. All rights reserved.`,
}: FooterProps) {
  // Default footer columns if none are provided
  const defaultColumns: FooterColumn[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', link: '/features' },
        { label: 'Pricing', link: '/pricing' },
        { label: 'Documentation', link: '/docs' },
        { label: 'Changelog', link: '/changelog' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', link: '/blog' },
        { label: 'Tutorials', link: '/tutorials' },
        { label: 'Examples', link: '/examples' },
        { label: 'Community', link: '/community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', link: '/about' },
        { label: 'Contact', link: '/contact' },
        { label: 'Careers', link: '/careers' },
        { label: 'Legal', link: '/legal' },
      ],
    },
  ];

  const displayColumns = columns.length > 0 ? columns : defaultColumns;

  return (
    <Box component="footer" py={50} style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={50}>
          {/* Logo and social links */}
          <Stack>
            {logo}
            <Text size="sm" c="dimmed" mt="xs">
              Build your SaaS application faster with our comprehensive toolkit.
            </Text>
            
            <Group mt="lg">
              <ActionIcon size="lg" variant="subtle" component="a" href="https://github.com" target="_blank">
                <IconBrandGithub size={18} />
              </ActionIcon>
              <ActionIcon size="lg" variant="subtle" component="a" href="https://twitter.com" target="_blank">
                <IconBrandTwitter size={18} />
              </ActionIcon>
              <ActionIcon size="lg" variant="subtle" component="a" href="https://linkedin.com" target="_blank">
                <IconBrandLinkedin size={18} />
              </ActionIcon>
              <ActionIcon size="lg" variant="subtle" component="a" href="https://discord.com" target="_blank">
                <IconBrandDiscord size={18} />
              </ActionIcon>
            </Group>
          </Stack>

          {/* Navigation columns */}
          {displayColumns.map((column, index) => (
            <Stack key={index} gap="xs">
              <Text fw={700}>{column.title}</Text>
              {column.links.map((link, linkIndex) => (
                <Anchor
                  key={linkIndex}
                  component={Link}
                  href={link.link}
                  c="dimmed"
                  size="sm"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>
          ))}
        </SimpleGrid>

        <Divider my={30} />

        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {copyright}
          </Text>
          <Group gap="xs">
            <Anchor component={Link} href="/privacy" c="dimmed" size="sm">
              Privacy Policy
            </Anchor>
            <Text c="dimmed" size="sm">•</Text>
            <Anchor component={Link} href="/terms" c="dimmed" size="sm">
              Terms of Service
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  );
} 