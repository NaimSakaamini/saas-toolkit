# Naim SaaS Toolkit Documentation

Welcome to the comprehensive documentation for the Naim SaaS Toolkit. This documentation is designed to help you understand, use, and customize the toolkit for your specific SaaS application needs.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Architecture Overview](#architecture-overview)
4. [Core Services](#core-services)
5. [Components](#components)
6. [Customization](#customization)
7. [API Reference](#api-reference)
8. [Guides](#guides)
9. [Examples](#examples)
10. [Troubleshooting](#troubleshooting)

## Introduction

The Naim SaaS Toolkit is a comprehensive solution for building SaaS (Software as a Service) applications using Next.js and Firebase. It provides all the essential components and services needed to build a modern SaaS application, including:

- Authentication and user management
- Organization and team management
- Role-based access control
- Invitation system
- Billing and subscription management with Stripe integration
- Landing page components
- Dashboard framework
- User onboarding tools

The toolkit is built with TypeScript, uses Mantine UI for components, and leverages Firebase for backend services. It follows a modular architecture that allows for easy customization and extension.

## Getting Started

To get started with the Naim SaaS Toolkit, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/naim-saas-toolkit.git
   cd naim-saas-toolkit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Set up Firebase indexes**:
   ```bash
   npm run firebase:deploy-indexes
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

For more detailed setup instructions, see the [Getting Started Guide](./guides/getting-started.md).

## Architecture Overview

The Naim SaaS Toolkit follows a modular architecture with clear separation of concerns:

```
naim-saas-toolkit/
├── app/              # Next.js app directory (pages and routes)
├── components/       # UI components
│   ├── dashboard/    # Dashboard-specific components
│   ├── landing/      # Landing page components
│   ├── organization/ # Organization management components
│   ├── subscription/ # Subscription and billing components
│   ├── ui/           # Generic UI components
│   └── invitation/   # Invitation system components
├── services/         # Core services
│   ├── auth/         # Authentication services
│   ├── firebase/     # Firebase configuration and services
│   ├── organization/ # Organization management services
│   ├── subscription/ # Subscription and billing services
│   └── invitation/   # Invitation system services
├── lib/              # Utility functions and helpers
├── public/           # Static assets
└── scripts/          # Utility scripts for setup and deployment
```

Each service and component is designed to be modular and reusable, with clear interfaces and separation of concerns. This architecture allows for easy customization and extension of the toolkit.

For more details on the architecture, see the [Architecture Guide](./guides/architecture.md).

## Core Services

The toolkit provides several core services that handle different aspects of a SaaS application:

- **Firebase Service**: Handles Firebase initialization and provides access to Firebase services.
- **Authentication Service**: Manages user authentication, registration, and session management.
- **Organization Service**: Handles organization creation, management, and member roles.
- **Invitation Service**: Manages invitations to organizations.
- **Subscription Service**: Handles subscription plans, payment methods, and billing.

Each service is implemented as a React context provider that makes the service available throughout the application. For more details on each service, see the [Core Services Guide](./guides/core-services.md).

## Components

The toolkit includes a wide range of components for building SaaS applications:

- **Landing Page Components**: Hero, Feature Showcase, Pricing Table, FAQ, Call to Action, Footer
- **Dashboard Components**: Dashboard Layout, Stats Cards, Activity Feed, Subscription Widget
- **Organization Components**: Organization Selector, Create Organization Form, Member Management
- **Subscription Components**: Subscription Manager, Payment Method Manager, Invoice List, Usage Display
- **Authentication Components**: Login, Register, Password Reset, Protected Route
- **Invitation Components**: Invite User Form, Invitation List, Accept Invitation

Each component is designed to be modular and customizable. For more details on each component, see the [Components Guide](./guides/components.md).

## Customization

The Naim SaaS Toolkit is designed to be highly customizable. You can customize:

- **Theme**: Colors, typography, spacing, and other design tokens
- **Components**: Modify existing components or create new ones
- **Services**: Extend or replace core services with your own implementations
- **Routes**: Add new routes or modify existing ones
- **Firebase Configuration**: Use your own Firebase project and configuration

For more details on customization, see the [Customization Guide](./guides/customization.md).

## API Reference

Detailed API reference documentation is available for all services and components:

- [Firebase Service API](./api-reference/firebase-service.md)
- [Authentication Service API](./api-reference/auth-service.md)
- [Organization Service API](./api-reference/organization-service.md)
- [Invitation Service API](./api-reference/invitation-service.md)
- [Subscription Service API](./api-reference/subscription-service.md)
- [Component API Reference](./api-reference/components.md)

## Guides

Step-by-step guides for common tasks:

- [Getting Started](./guides/getting-started.md)
- [Firebase Setup](./guides/firebase-setup.md)
- [Authentication Implementation](./guides/authentication.md)
- [Organization Management](./guides/organization-management.md)
- [Invitation System](./guides/invitation-system.md)
- [Subscription and Billing](./guides/subscription-billing.md)
- [Customizing the Theme](./guides/theming.md)
- [Creating Custom Components](./guides/custom-components.md)
- [Extending Core Services](./guides/extending-services.md)
- [Deployment](./guides/deployment.md)

## Examples

Example applications and use cases:

- [Basic SaaS Application](./examples/basic-saas.md)
- [Team Collaboration Tool](./examples/team-collaboration.md)
- [Customer Support Platform](./examples/customer-support.md)
- [Content Management System](./examples/cms.md)
- [E-commerce Platform](./examples/e-commerce.md)

## Troubleshooting

Common issues and their solutions:

- [Firebase Configuration Issues](./troubleshooting.md#firebase-configuration-issues)
- [Authentication Problems](./troubleshooting.md#authentication-problems)
- [Organization Management Issues](./troubleshooting.md#organization-management-issues)
- [Subscription and Billing Issues](./troubleshooting.md#subscription-and-billing-issues)
- [Deployment Problems](./troubleshooting.md#deployment-problems)

For more troubleshooting information, see the [Troubleshooting Guide](./troubleshooting.md).

## Contributing

We welcome contributions to the Naim SaaS Toolkit! Please see our [Contributing Guide](../CONTRIBUTING.md) for more information.

## License

The Naim SaaS Toolkit is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more information. 