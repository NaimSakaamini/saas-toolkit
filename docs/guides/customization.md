# Customization Guide

This guide provides detailed instructions on how to customize the Naim SaaS Toolkit for your specific SaaS application needs. It is designed to be comprehensive enough for both human developers and AI agents to follow.

## Table of Contents

1. [Introduction](#introduction)
2. [Project Renaming and Branding](#project-renaming-and-branding)
3. [Theme Customization](#theme-customization)
4. [Component Customization](#component-customization)
5. [Service Customization](#service-customization)
6. [Route Customization](#route-customization)
7. [Firebase Configuration](#firebase-configuration)
8. [Domain-Specific Customization](#domain-specific-customization)
9. [AI-Assisted Customization](#ai-assisted-customization)
10. [Customization Checklist](#customization-checklist)

## Introduction

The Naim SaaS Toolkit is designed to be highly customizable, allowing you to adapt it to your specific SaaS application needs. This guide will walk you through the process of customizing various aspects of the toolkit, from simple branding changes to complex domain-specific customizations.

## Project Renaming and Branding

### Renaming the Project

To rename the project from "Naim SaaS Toolkit" to your own SaaS application name, follow these steps:

1. **Update package.json**:
   ```json
   {
     "name": "your-saas-app-name",
     "version": "0.1.0",
     "private": true,
     // ...
   }
   ```

2. **Update Next.js Metadata** in `app/layout.tsx`:
   ```tsx
   export const metadata: Metadata = {
     title: "Your SaaS App Name",
     description: "Your SaaS app description",
   };
   ```

3. **Update AppLayout Component** in `components/layout/AppLayout.tsx`:
   ```tsx
   <Text fw={700} size="lg" component={Link} href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
     Your SaaS App Name
   </Text>
   ```

4. **Update DashboardLayout Component** in `components/dashboard/DashboardLayout.tsx`:
   ```tsx
   <Text fw={700} size="lg" component={Link} href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
     {collapsed ? 'YSA' : 'Your SaaS App Name'}
   </Text>
   ```

5. **Update Landing Page Components**:
   - Update the hero title and subtitle in `components/landing/Hero.tsx`
   - Update the feature showcase title in `components/landing/FeatureShowcase.tsx`
   - Update the pricing section title in `components/landing/PricingSection.tsx`
   - Update the FAQ title in `components/landing/FaqAccordion.tsx`
   - Update the call to action title in `components/landing/CallToAction.tsx`
   - Update the footer copyright in `components/landing/Footer.tsx`

6. **Update Documentation**:
   - Update the README.md file with your SaaS app name and description
   - Update the documentation files in the `docs` directory

### Customizing Branding Assets

1. **Replace Logo**:
   - Replace the logo files in the `public` directory with your own logo files
   - Update the favicon.ico file with your own favicon

2. **Update Color Scheme**:
   - Modify the theme colors in `components/ui/ThemeProvider.tsx` (see [Theme Customization](#theme-customization) for details)

3. **Update Landing Page Images**:
   - Replace the images in the `public` directory with your own images
   - Update the image references in the landing page components

## Theme Customization

The toolkit uses Mantine UI for components and styling. You can customize the theme by modifying the `components/ui/ThemeProvider.tsx` file.

### Customizing Colors

```tsx
// components/ui/ThemeProvider.tsx
const theme = createTheme({
  primaryColor: 'blue', // Change to your primary color
  colors: {
    // Define custom colors
    brand: [
      '#f0f9ff',
      '#e0f2fe',
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e',
    ],
  },
  // ...
});
```

### Customizing Typography

```tsx
// components/ui/ThemeProvider.tsx
const theme = createTheme({
  // ...
  fontFamily: 'Your Font Family, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Your Heading Font Family, sans-serif',
    sizes: {
      h1: { fontSize: '2.5rem' },
      h2: { fontSize: '2rem' },
      h3: { fontSize: '1.5rem' },
      h4: { fontSize: '1.25rem' },
      h5: { fontSize: '1rem' },
      h6: { fontSize: '0.875rem' },
    },
  },
  // ...
});
```

### Customizing Component Styles

```tsx
// components/ui/ThemeProvider.tsx
const theme = createTheme({
  // ...
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    // Add more component customizations
  },
  // ...
});
```

## Component Customization

### Modifying Existing Components

To modify an existing component, you can either:

1. **Edit the component directly** in the `components` directory
2. **Create a new component** that wraps the existing component with your customizations
3. **Override the component** by creating a new component with the same name in your project

Example of wrapping an existing component:

```tsx
// components/custom/CustomButton.tsx
import { Button, ButtonProps } from '@mantine/core';

interface CustomButtonProps extends ButtonProps {
  // Add your custom props
}

export function CustomButton({ children, ...props }: CustomButtonProps) {
  return (
    <Button
      radius="xl"
      size="md"
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Creating New Components

To create a new component:

1. Create a new file in the appropriate directory (e.g., `components/custom/YourComponent.tsx`)
2. Import the necessary dependencies
3. Define your component
4. Export your component

Example:

```tsx
// components/custom/FeatureCard.tsx
import { Card, Text, Title, Image } from '@mantine/core';

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

export function FeatureCard({ title, description, imageSrc }: FeatureCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={imageSrc} height={160} alt={title} />
      </Card.Section>
      <Title order={3} mt="md">{title}</Title>
      <Text mt="xs" c="dimmed">{description}</Text>
    </Card>
  );
}
```

### Customizing Landing Page Components

The landing page components are located in the `components/landing` directory. You can customize them to match your SaaS application's branding and messaging:

1. **Hero Component** (`components/landing/Hero.tsx`):
   - Update the title, subtitle, and button text
   - Replace the background image or animation

2. **Feature Showcase Component** (`components/landing/FeatureShowcase.tsx`):
   - Update the features list with your SaaS application's features
   - Customize the feature icons and descriptions

3. **Pricing Table Component** (`components/landing/PricingTable.tsx`):
   - Update the pricing plans with your SaaS application's pricing
   - Customize the features included in each plan

4. **FAQ Component** (`components/landing/FaqAccordion.tsx`):
   - Update the FAQ items with questions and answers relevant to your SaaS application

5. **Call to Action Component** (`components/landing/CallToAction.tsx`):
   - Update the title, description, and button text
   - Customize the background gradient or image

## Service Customization

### Extending Existing Services

To extend an existing service, you can:

1. Create a new service provider that wraps the existing service provider
2. Add your custom functionality to the new service provider
3. Use the new service provider in your application

Example of extending the `AuthProvider`:

```tsx
// services/custom/CustomAuthProvider.tsx
import { ReactNode, useState } from 'react';
import { AuthProvider, useAuth, AuthContextType } from '@/services/auth/AuthProvider';

interface CustomAuthContextType extends AuthContextType {
  // Add your custom properties and functions
  lastLoginTime: Date | null;
  updateLastLoginTime: () => void;
}

const CustomAuthContext = createContext<CustomAuthContextType | null>(null);

interface CustomAuthProviderProps {
  children: ReactNode;
}

export function CustomAuthProvider({ children }: CustomAuthProviderProps) {
  const [lastLoginTime, setLastLoginTime] = useState<Date | null>(null);

  const updateLastLoginTime = () => {
    setLastLoginTime(new Date());
  };

  return (
    <AuthProvider>
      <CustomAuthContext.Provider value={{ 
        ...useAuth(), 
        lastLoginTime, 
        updateLastLoginTime 
      }}>
        {children}
      </CustomAuthContext.Provider>
    </AuthProvider>
  );
}

export function useCustomAuth(): CustomAuthContextType {
  const context = useContext(CustomAuthContext);
  
  if (!context) {
    throw new Error('useCustomAuth must be used within a CustomAuthProvider');
  }
  
  return context;
}
```

### Creating New Services

To create a new service:

1. Create a new service provider in the `services` directory
2. Define your service context and provider
3. Implement your service functions
4. Export your service provider and hook

Example of creating a new analytics service:

```tsx
// services/analytics/AnalyticsProvider.tsx
import { ReactNode, createContext, useContext, useState } from 'react';
import { useFirebase } from '@/services/firebase/FirebaseProvider';
import { useAuth } from '@/services/auth/AuthProvider';
import { useOrganization } from '@/services/organization/OrganizationProvider';

interface AnalyticsContextType {
  trackEvent: (eventName: string, eventData?: Record<string, any>) => Promise<void>;
  getAnalyticsData: (metric: string, timeRange: string) => Promise<any>;
  analyticsData: Record<string, any>;
  loading: boolean;
  error: Error | null;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { services } = useFirebase();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const [analyticsData, setAnalyticsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const trackEvent = async (eventName: string, eventData?: Record<string, any>) => {
    // Implementation
  };
  
  const getAnalyticsData = async (metric: string, timeRange: string) => {
    // Implementation
  };
  
  return (
    <AnalyticsContext.Provider value={{ 
      trackEvent, 
      getAnalyticsData, 
      analyticsData, 
      loading, 
      error 
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  
  return context;
}
```

## Route Customization

### Adding New Routes

To add a new route to your application:

1. Create a new page component in the `app` directory
2. Define the page component
3. Export the page component as the default export

Example of adding a new route:

```tsx
// app/features/page.tsx
'use client';

import { Container, Title, Text, SimpleGrid } from '@mantine/core';
import { AppLayout } from '@/components/layout/AppLayout';
import { FeatureCard } from '@/components/custom/FeatureCard';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Feature 1',
      description: 'Description of feature 1',
      imageSrc: '/images/feature1.jpg',
    },
    // Add more features
  ];

  return (
    <AppLayout>
      <Container size="lg" py="xl">
        <Title order={1} ta="center" mb="xl">Features</Title>
        <Text size="lg" ta="center" mb="xl">
          Discover all the powerful features of our SaaS application.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </SimpleGrid>
      </Container>
    </AppLayout>
  );
}
```

### Modifying Existing Routes

To modify an existing route:

1. Edit the page component in the `app` directory
2. Update the component to match your requirements

Example of modifying the dashboard page:

```tsx
// app/dashboard/page.tsx
'use client';

import { Container, Title, Text, SimpleGrid, Card } from '@mantine/core';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/services/auth/ProtectedRoute';
import { CustomStatsCard } from '@/components/custom/CustomStatsCard';
import { SubscriptionWidget } from '@/components/dashboard/SubscriptionWidget';
import { useCustomAnalytics } from '@/services/custom/CustomAnalyticsProvider';

export default function DashboardPage() {
  const { analyticsData } = useCustomAnalytics();
  
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container size="lg" py="xl">
          <Title order={1} mb="lg">Welcome to Your Dashboard</Title>
          
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
            <CustomStatsCard
              title="Active Users"
              value={analyticsData.activeUsers || '0'}
              description="Users active in the last 30 days"
              // ...
            />
            {/* Add more stats cards */}
          </SimpleGrid>
          
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            {/* Your custom dashboard widgets */}
            <SubscriptionWidget />
          </SimpleGrid>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

## Firebase Configuration

### Customizing Firebase Configuration

To use your own Firebase project:

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable the services you need (Authentication, Firestore, etc.)
3. Get your Firebase configuration from the Firebase console
4. Update the `.env.local` file with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Customizing Firestore Schema

To customize the Firestore schema for your SaaS application:

1. Update the service functions in the `services` directory to match your schema
2. Update the type definitions to match your schema
3. Update the components that use the services to match your schema

Example of customizing the organization schema:

```typescript
// services/organization/organizationService.ts
export interface Organization {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string;
  ownerId: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  members: OrganizationMember[];
  settings?: Record<string, any>;
  // Add your custom fields
  industry?: string;
  size?: 'small' | 'medium' | 'large';
  location?: string;
  website?: string;
}

// Update the createOrganization function to include your custom fields
export const createOrganization = async (
  services: FirebaseServices,
  orgData: Partial<Organization>
): Promise<string> => {
  // Implementation
};
```

## Domain-Specific Customization

### Adapting for Different SaaS Domains

The toolkit can be adapted for various SaaS domains. Here are some examples:

#### Project Management SaaS

1. **Add Project-Specific Models**:
   - Create a `Project` model with fields like name, description, status, etc.
   - Create a `Task` model with fields like title, description, assignee, due date, etc.
   - Create a `Comment` model for task comments

2. **Add Project-Specific Services**:
   - Create a `ProjectProvider` for managing projects
   - Create a `TaskProvider` for managing tasks

3. **Add Project-Specific Components**:
   - Create a `ProjectList` component for displaying projects
   - Create a `TaskBoard` component for displaying tasks in a Kanban board
   - Create a `TaskDetail` component for displaying task details

4. **Add Project-Specific Routes**:
   - Add a `/dashboard/projects` route for displaying projects
   - Add a `/dashboard/projects/[projectId]` route for displaying project details
   - Add a `/dashboard/projects/[projectId]/tasks/[taskId]` route for displaying task details

#### Customer Support SaaS

1. **Add Support-Specific Models**:
   - Create a `Ticket` model with fields like subject, description, status, etc.
   - Create a `Customer` model with fields like name, email, company, etc.
   - Create a `Response` model for ticket responses

2. **Add Support-Specific Services**:
   - Create a `TicketProvider` for managing tickets
   - Create a `CustomerProvider` for managing customers

3. **Add Support-Specific Components**:
   - Create a `TicketList` component for displaying tickets
   - Create a `TicketDetail` component for displaying ticket details
   - Create a `CustomerList` component for displaying customers

4. **Add Support-Specific Routes**:
   - Add a `/dashboard/tickets` route for displaying tickets
   - Add a `/dashboard/tickets/[ticketId]` route for displaying ticket details
   - Add a `/dashboard/customers` route for displaying customers

#### E-commerce SaaS

1. **Add E-commerce-Specific Models**:
   - Create a `Product` model with fields like name, description, price, etc.
   - Create a `Order` model with fields like customer, products, total, etc.
   - Create a `Customer` model with fields like name, email, address, etc.

2. **Add E-commerce-Specific Services**:
   - Create a `ProductProvider` for managing products
   - Create a `OrderProvider` for managing orders
   - Create a `CustomerProvider` for managing customers

3. **Add E-commerce-Specific Components**:
   - Create a `ProductList` component for displaying products
   - Create a `OrderList` component for displaying orders
   - Create a `CustomerList` component for displaying customers

4. **Add E-commerce-Specific Routes**:
   - Add a `/dashboard/products` route for displaying products
   - Add a `/dashboard/orders` route for displaying orders
   - Add a `/dashboard/customers` route for displaying customers

## AI-Assisted Customization

This section provides guidance specifically for AI agents that are customizing the Naim SaaS Toolkit for a specific SaaS application idea.

### Step 1: Understand the SaaS Application Requirements

Before making any changes, thoroughly analyze the SaaS application requirements:

1. **Domain and Purpose**: Understand the specific domain (e.g., project management, customer support, e-commerce) and the primary purpose of the application.

2. **Core Features**: Identify the core features that need to be implemented.

3. **User Roles**: Understand the different user roles and their permissions.

4. **Data Models**: Identify the main data entities and their relationships.

5. **UI/UX Requirements**: Understand the user interface and experience requirements.

### Step 2: Project Renaming and Initial Setup

1. **Rename the Project**:
   - Update all occurrences of "Naim SaaS Toolkit" with the new SaaS application name.
   - Update package.json, metadata, and component text as described in the [Project Renaming and Branding](#project-renaming-and-branding) section.

2. **Update Firebase Configuration**:
   - Either use the provided Firebase configuration or set up a new Firebase project.
   - Update the .env.local file with the appropriate Firebase configuration.

3. **Update Theme**:
   - Customize the theme colors, typography, and component styles to match the SaaS application's branding.

### Step 3: Domain-Specific Customization

1. **Define Data Models**:
   - Create interfaces for the domain-specific data models in appropriate files.
   - Example: For a project management SaaS, create `Project`, `Task`, and `Comment` interfaces.

2. **Create Service Providers**:
   - Create service providers for the domain-specific services.
   - Example: For a project management SaaS, create `ProjectProvider`, `TaskProvider`, etc.

3. **Implement Service Functions**:
   - Implement the necessary functions for each service provider.
   - Example: For a `ProjectProvider`, implement functions like `createProject`, `getProjects`, `updateProject`, etc.

4. **Create Components**:
   - Create components for the domain-specific features.
   - Example: For a project management SaaS, create `ProjectList`, `TaskBoard`, etc.

5. **Create Routes**:
   - Create routes for the domain-specific pages.
   - Example: For a project management SaaS, create routes like `/dashboard/projects`, `/dashboard/projects/[projectId]`, etc.

### Step 4: Customization Validation

1. **Check for Naming Consistency**:
   - Ensure all occurrences of "Naim SaaS Toolkit" have been replaced with the new SaaS application name.
   - Check for consistent naming in components, services, and documentation.

2. **Validate Data Flow**:
   - Ensure the data flows correctly through the application.
   - Check that services are properly initialized and used in components.

3. **Test User Flows**:
   - Validate the main user flows, such as authentication, organization management, and domain-specific flows.

4. **Update Documentation**:
   - Update the documentation to reflect the changes made to the toolkit.
   - Add domain-specific documentation for the new features.

### Example AI Prompt for Customization

Here's an example prompt that can be used to instruct an AI agent to customize the Naim SaaS Toolkit:

```
I want you to customize the Naim SaaS Toolkit for a [DOMAIN] SaaS application called "[APP NAME]". The application should [BRIEF DESCRIPTION OF PURPOSE].

Key features:
1. [FEATURE 1]
2. [FEATURE 2]
3. [FEATURE 3]
...

User roles:
1. [ROLE 1] - [DESCRIPTION]
2. [ROLE 2] - [DESCRIPTION]
...

Data models:
1. [MODEL 1] - [FIELDS]
2. [MODEL 2] - [FIELDS]
...

Branding:
- Primary color: [COLOR]
- Secondary color: [COLOR]
- Font: [FONT]
- Logo: [DESCRIPTION]

Please provide a step-by-step plan for customizing the toolkit, including:
1. Project renaming and branding changes
2. Data model definitions
3. Service provider implementations
4. Component customizations
5. Route additions
6. Any other necessary changes

Then, implement these changes one by one, explaining what you're doing at each step.
```

## Customization Checklist

Use this checklist to ensure you've covered all aspects of customization:

### Project Renaming and Branding
- [ ] Update package.json with new name
- [ ] Update Next.js metadata
- [ ] Update AppLayout component
- [ ] Update DashboardLayout component
- [ ] Update landing page components
- [ ] Update documentation
- [ ] Replace logo and favicon
- [ ] Update color scheme

### Theme Customization
- [ ] Customize colors
- [ ] Customize typography
- [ ] Customize component styles

### Component Customization
- [ ] Modify existing components as needed
- [ ] Create new components for domain-specific features
- [ ] Customize landing page components

### Service Customization
- [ ] Extend existing services as needed
- [ ] Create new services for domain-specific features

### Route Customization
- [ ] Add new routes for domain-specific pages
- [ ] Modify existing routes as needed

### Firebase Configuration
- [ ] Update Firebase configuration
- [ ] Customize Firestore schema

### Domain-Specific Customization
- [ ] Define domain-specific data models
- [ ] Create domain-specific service providers
- [ ] Implement domain-specific service functions
- [ ] Create domain-specific components
- [ ] Create domain-specific routes

### Documentation
- [ ] Update README.md
- [ ] Update documentation files
- [ ] Add domain-specific documentation 