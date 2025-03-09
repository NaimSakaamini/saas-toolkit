'use client';

import { Container, Title, Text, Accordion, Stack } from '@mantine/core';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  title?: string;
  description?: string;
  faqs?: FaqItem[];
}

export function FaqAccordion({
  title = 'Frequently Asked Questions',
  description = 'Find answers to common questions about Naim SaaS Toolkit.',
  faqs = [],
}: FaqAccordionProps) {
  // Default FAQs if none are provided
  const defaultFaqs: FaqItem[] = [
    {
      question: 'What is Naim SaaS Toolkit?',
      answer: 'Naim SaaS Toolkit is a comprehensive solution for building SaaS applications with Next.js and Firebase. It provides all the essential components and services needed to build a modern SaaS application, including authentication, organization management, and more.'
    },
    {
      question: 'Is Naim SaaS Toolkit free to use?',
      answer: 'Yes, Naim SaaS Toolkit has a free tier that includes basic features for individuals and small teams. We also offer paid plans with additional features and higher usage limits for growing businesses and enterprises.'
    },
    {
      question: 'Do I need to know Firebase to use this toolkit?',
      answer: 'No, you don\'t need to be a Firebase expert. The toolkit abstracts away most of the Firebase-specific code, allowing you to focus on building your application. However, basic knowledge of Firebase concepts will be helpful.'
    },
    {
      question: 'Can I customize the UI components?',
      answer: 'Absolutely! All UI components are built with Mantine UI and are fully customizable. You can modify the styles, themes, and behavior to match your brand and requirements.'
    },
    {
      question: 'How do I handle user authentication?',
      answer: 'The toolkit includes a complete authentication system with login, registration, password reset, and session management. It supports email/password authentication and Google sign-in out of the box.'
    },
    {
      question: 'Does it support multi-tenancy?',
      answer: 'Yes, the toolkit includes organization management features that enable multi-tenancy. Users can create and join multiple organizations, and you can implement role-based access control within each organization.'
    },
    {
      question: 'Is there documentation available?',
      answer: 'Yes, comprehensive documentation is available that covers all aspects of the toolkit, including installation, configuration, and usage of all components and services.'
    }
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <Container size="lg" py={80}>
      <Stack align="center" mb={50}>
        <Title order={2} ta="center">
          {title}
        </Title>
        <Text ta="center" c="dimmed" maw={600} mx="auto" size="lg">
          {description}
        </Text>
      </Stack>

      <Accordion variant="separated" radius="md">
        {displayFaqs.map((faq, index) => (
          <Accordion.Item key={index} value={`item-${index}`}>
            <Accordion.Control>
              <Text fw={500}>{faq.question}</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">{faq.answer}</Text>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
} 