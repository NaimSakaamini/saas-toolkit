# Naim SaaS Toolkit

A comprehensive toolkit for building SaaS applications with Next.js and Firebase.

## Overview

Naim SaaS Toolkit provides everything you need to build a modern SaaS application, including:

- Authentication and user management
- Organization and team management
- Role-based access control
- Invitation system
- Billing and subscription management
- Landing page components
- Dashboard framework
- User onboarding tools
- Feature management

## Features

- **Next.js App Router**: Built with the latest Next.js features
- **Firebase Integration**: Seamless integration with Firebase Authentication and Firestore
- **Mantine UI**: Beautiful, accessible UI components
- **TypeScript**: Full TypeScript support for better developer experience
- **Responsive Design**: Works on all devices
- **Dark Mode**: Built-in dark mode support
- **SEO Optimized**: SEO-friendly by default

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/naim-saas-toolkit.git

# Navigate to the project directory
cd naim-saas-toolkit

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file in the root directory with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Firebase Setup

This project requires specific Firestore indexes to function properly. You can set these up in two ways:

#### Option 1: Using the Provided Script

```bash
# Deploy Firebase indexes
npm run firebase:deploy-indexes

# Set up subscription collections (optional)
npm run firebase:setup-subscriptions
```

#### Option 2: Manual Setup

For detailed instructions on setting up Firebase manually, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

### Development

```bash
# Start the development server
npm run dev

# Start with Firebase emulator
npm run firebase:emulator
```

Visit `http://localhost:3000` to see your application.

## Project Structure

```
naim-saas-toolkit/
├── app/              # Next.js app directory
├── components/       # UI components
├── lib/              # Utility functions
├── services/         # Core services
├── scripts/          # Utility scripts
└── public/           # Static assets
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run firebase:emulator` - Run the application with Firebase emulator
- `npm run firebase:deploy-indexes` - Deploy Firestore indexes
- `npm run firebase:setup-subscriptions` - Set up subscription collections

## Troubleshooting

### Firebase Index Errors

If you encounter errors like:

```
Error getting subscription by organization ID: FirebaseError: The query requires an index.
```

This means you need to set up the required Firestore indexes. Follow the instructions in the [Firebase Setup](#firebase-setup) section.

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Architecture Guide](docs/architecture.md) - Detailed explanation of the project architecture
- [API Reference](docs/api-reference.md) - API documentation for the Firebase service
- [Customization Guide](docs/guides/customization.md) - Guide for customizing the toolkit for your specific SaaS application
- [Deployment Guide](docs/guides/deployment.md) - Guide for deploying your SaaS application to various platforms

## License

MIT © [Your Name]

## Acknowledgements

This project builds upon the work done in the [Firebase Auth Wrapper](https://github.com/yourusername/firebase-auth-wrapper) package. 