# Architecture Guide

This guide provides a detailed overview of the Naim SaaS Toolkit's architecture, explaining how the different components and services work together to create a complete SaaS application.

## Table of Contents

1. [Architectural Overview](#architectural-overview)
2. [Project Structure](#project-structure)
3. [Core Services](#core-services)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [Routing](#routing)
8. [Authentication Flow](#authentication-flow)
9. [Organization Management Flow](#organization-management-flow)
10. [Invitation Flow](#invitation-flow)
11. [Subscription and Billing Flow](#subscription-and-billing-flow)
12. [Extending the Architecture](#extending-the-architecture)

## Architectural Overview

The Naim SaaS Toolkit follows a modular, service-oriented architecture built on top of Next.js and Firebase. The architecture is designed to be:

- **Modular**: Each part of the system is encapsulated in its own module with clear interfaces.
- **Extensible**: Services and components can be extended or replaced without affecting the rest of the system.
- **Scalable**: The architecture supports scaling to handle more users, organizations, and features.
- **Maintainable**: Code is organized in a way that makes it easy to understand and maintain.

The architecture consists of several layers:

1. **UI Layer**: React components that make up the user interface.
2. **Service Layer**: Context providers that encapsulate business logic and data access.
3. **Data Access Layer**: Functions that interact with Firebase services.
4. **Infrastructure Layer**: Firebase services (Authentication, Firestore, etc.).

## Project Structure

The project is organized into the following directories:

```
naim-saas-toolkit/
├── app/                  # Next.js app directory (pages and routes)
│   ├── auth/             # Authentication pages (login, register, etc.)
│   ├── dashboard/        # Dashboard pages
│   ├── invitation/       # Invitation pages
│   └── pricing/          # Pricing and subscription pages
├── components/           # UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── landing/          # Landing page components
│   ├── organization/     # Organization management components
│   ├── subscription/     # Subscription and billing components
│   ├── ui/               # Generic UI components
│   └── invitation/       # Invitation system components
├── services/             # Core services
│   ├── auth/             # Authentication services
│   ├── firebase/         # Firebase configuration and services
│   ├── organization/     # Organization management services
│   ├── subscription/     # Subscription and billing services
│   └── invitation/       # Invitation system services
├── lib/                  # Utility functions and helpers
├── public/               # Static assets
└── scripts/              # Utility scripts for setup and deployment
```

### Key Files

- `app/layout.tsx`: The root layout component that wraps all pages.
- `services/firebase/FirebaseProvider.tsx`: Initializes Firebase and provides Firebase services.
- `services/auth/AuthProvider.tsx`: Manages authentication state and provides auth functions.
- `services/organization/OrganizationProvider.tsx`: Manages organization state and operations.
- `services/invitation/InvitationProvider.tsx`: Manages invitation state and operations.
- `services/subscription/SubscriptionProvider.tsx`: Manages subscription state and operations.

## Core Services

The toolkit is built around several core services, each implemented as a React context provider:

### Firebase Service

The Firebase service (`FirebaseProvider`) is responsible for:

- Initializing Firebase with the provided configuration
- Providing access to Firebase services (Auth, Firestore, etc.)
- Managing Firebase connection state

```typescript
// services/firebase/FirebaseProvider.tsx
export function FirebaseProvider({ children, config, app, auth, db }) {
  // Initialize Firebase services
  const services = useMemo(() => {
    return getFirebaseServices(config, app, auth, db);
  }, [config, app, auth, db]);

  return (
    <FirebaseContext.Provider value={{ services }}>
      {children}
    </FirebaseContext.Provider>
  );
}
```

### Authentication Service

The Authentication service (`AuthProvider`) is responsible for:

- Managing user authentication state
- Providing authentication functions (sign in, sign up, sign out, etc.)
- Managing user sessions
- Handling password reset and email verification

```typescript
// services/auth/AuthProvider.tsx
export function AuthProvider({ children }) {
  const { services } = useFirebase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Authentication functions
  const signInWithEmail = async (email, password) => { /* ... */ };
  const signInWithGoogle = async () => { /* ... */ };
  const signUp = async (email, password, displayName) => { /* ... */ };
  const signOut = async () => { /* ... */ };
  // ...

  return (
    <AuthContext.Provider value={{ 
      user, loading, error, 
      signInWithEmail, signInWithGoogle, signUp, signOut, 
      // ...
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Organization Service

The Organization service (`OrganizationProvider`) is responsible for:

- Managing organization state
- Providing organization operations (create, update, delete)
- Managing organization members and roles
- Handling current organization selection

```typescript
// services/organization/OrganizationProvider.tsx
export function OrganizationProvider({ children }) {
  const { services } = useFirebase();
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Organization functions
  const createNewOrganization = async (orgData) => { /* ... */ };
  const updateOrgDetails = async (orgId, orgData) => { /* ... */ };
  const deleteOrg = async (orgId) => { /* ... */ };
  // ...

  return (
    <OrganizationContext.Provider value={{ 
      organizations, currentOrganization, loading, error,
      createNewOrganization, updateOrgDetails, deleteOrg,
      // ...
    }}>
      {children}
    </OrganizationContext.Provider>
  );
}
```

### Invitation Service

The Invitation service (`InvitationProvider`) is responsible for:

- Managing invitation state
- Providing invitation operations (create, accept, decline, cancel)
- Handling invitation tokens and verification

```typescript
// services/invitation/InvitationProvider.tsx
export function InvitationProvider({ children }) {
  const { services } = useFirebase();
  const { currentOrganization } = useOrganization();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Invitation functions
  const createNewInvitation = async (invitationData) => { /* ... */ };
  const getInvitationByTokenString = async (token) => { /* ... */ };
  const acceptInvitationById = async (invitationId, userId) => { /* ... */ };
  // ...

  return (
    <InvitationContext.Provider value={{ 
      invitations, loading, error,
      createNewInvitation, getInvitationByTokenString, acceptInvitationById,
      // ...
    }}>
      {children}
    </InvitationContext.Provider>
  );
}
```

### Subscription Service

The Subscription service (`SubscriptionProvider`) is responsible for:

- Managing subscription state
- Providing subscription operations (create, update, cancel)
- Managing payment methods
- Handling invoices and billing
- Tracking usage metrics

```typescript
// services/subscription/SubscriptionProvider.tsx
export function SubscriptionProvider({ children }) {
  const { services } = useFirebase();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [usage, setUsage] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Subscription functions
  const createNewSubscription = async (planId) => { /* ... */ };
  const updateCurrentSubscription = async (data) => { /* ... */ };
  const cancelCurrentSubscription = async (cancelAtPeriodEnd) => { /* ... */ };
  // ...

  return (
    <SubscriptionContext.Provider value={{ 
      currentSubscription, currentPlan, paymentMethods, invoices, usage, loading, error,
      createNewSubscription, updateCurrentSubscription, cancelCurrentSubscription,
      // ...
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
```

## Component Architecture

The toolkit's components follow a hierarchical structure:

1. **Layout Components**: Define the overall structure of the application (AppLayout, DashboardLayout).
2. **Page Components**: Represent specific pages or views (Dashboard, Settings, Profile).
3. **Feature Components**: Implement specific features (OrganizationSelector, SubscriptionManager).
4. **UI Components**: Reusable UI elements (Button, Card, Modal).

Components are designed to be:

- **Composable**: Components can be combined to create more complex UIs.
- **Reusable**: Components can be used in multiple places with different props.
- **Stateless where possible**: Components delegate state management to services.
- **Responsive**: Components adapt to different screen sizes.

Example component structure:

```typescript
// components/subscription/SubscriptionManager.tsx
export function SubscriptionManager({ showTitle = true }) {
  const { 
    currentPlan, 
    currentSubscription, 
    updateCurrentSubscription,
    cancelCurrentSubscription,
    loading, 
    error 
  } = useSubscription();
  
  // Component state and handlers
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleSelectPlan = (plan) => { /* ... */ };
  const handleConfirmPlanChange = async () => { /* ... */ };
  
  // Render UI
  return (
    <Card>
      {showTitle && <Title>Subscription Management</Title>}
      {/* Component UI */}
    </Card>
  );
}
```

## Data Flow

Data flows through the application in the following way:

1. **User Interaction**: User interacts with a component (e.g., clicks a button).
2. **Component Handler**: Component calls a handler function.
3. **Service Function**: Handler calls a service function.
4. **Firebase Operation**: Service function performs operations on Firebase.
5. **State Update**: Service updates its state based on the operation result.
6. **Component Re-render**: Components that use the service re-render with the new state.

Example data flow for creating an organization:

```
User clicks "Create Organization" button
↓
CreateOrganizationForm.handleSubmit() is called
↓
useOrganization().createNewOrganization() is called
↓
organizationService.createOrganization() performs Firestore operations
↓
OrganizationProvider updates organizations state
↓
Components using useOrganization() re-render with the new organization
```

## State Management

The toolkit uses React Context for state management, with each service managing its own state:

- **Local Component State**: For UI state that doesn't need to be shared.
- **Service State**: For application state that needs to be shared across components.
- **Firebase Real-time Updates**: For data that needs to be synchronized with the server.

State is initialized when a service provider is mounted and updated in response to:

- User actions (e.g., creating an organization)
- Firebase real-time updates (e.g., a new invitation is received)
- Component mount/unmount (e.g., loading data when a component mounts)

## Routing

The toolkit uses Next.js App Router for routing, with the following structure:

- `/`: Landing page
- `/auth/login`: Login page
- `/auth/register`: Registration page
- `/auth/forgot-password`: Password reset page
- `/dashboard`: Dashboard page
- `/dashboard/settings`: Settings pages
- `/dashboard/settings/profile`: Profile settings
- `/dashboard/settings/organization`: Organization settings
- `/dashboard/settings/billing`: Billing settings
- `/invitation/[token]`: Invitation acceptance page
- `/pricing`: Pricing page
- `/checkout`: Checkout page

Routes are protected using the `ProtectedRoute` component, which redirects unauthenticated users to the login page.

## Authentication Flow

The authentication flow works as follows:

1. **Initialization**: `AuthProvider` initializes and sets up a listener for auth state changes.
2. **Sign In**: User signs in with email/password or Google.
3. **Auth State Change**: Firebase Auth triggers an auth state change event.
4. **State Update**: `AuthProvider` updates the user state.
5. **Session Management**: `AuthProvider` creates or updates the user's session.
6. **Organization Loading**: If the user is authenticated, `OrganizationProvider` loads the user's organizations.
7. **Current Organization**: If the user has a current organization set, it's loaded.

## Organization Management Flow

The organization management flow works as follows:

1. **Create Organization**: User creates a new organization.
2. **Add to User**: The organization is added to the user's organizations.
3. **Set as Current**: The new organization is set as the user's current organization.
4. **Invite Members**: User invites members to the organization.
5. **Manage Roles**: User assigns roles to organization members.
6. **Update Organization**: User updates organization details.
7. **Delete Organization**: User deletes the organization.

## Invitation Flow

The invitation flow works as follows:

1. **Create Invitation**: User creates an invitation for a new member.
2. **Send Email**: An email is sent to the invited user (simulated in the toolkit).
3. **Accept Invitation**: Invited user clicks the link in the email and is taken to the invitation page.
4. **Verify Token**: The invitation token is verified.
5. **Join Organization**: If the token is valid, the user joins the organization.
6. **Set Roles**: The user is assigned the role specified in the invitation.

## Subscription and Billing Flow

The subscription and billing flow works as follows:

1. **Select Plan**: User selects a subscription plan.
2. **Add Payment Method**: User adds a payment method.
3. **Create Subscription**: A subscription is created for the organization.
4. **Process Payment**: Payment is processed (simulated in the toolkit).
5. **Generate Invoice**: An invoice is generated for the subscription.
6. **Track Usage**: Usage metrics are tracked for the organization.
7. **Update/Cancel Subscription**: User can update or cancel the subscription.

## Extending the Architecture

The architecture is designed to be extended in several ways:

- **Add New Services**: Create new service providers for additional functionality.
- **Extend Existing Services**: Add new functions to existing service providers.
- **Add New Components**: Create new components that use the services.
- **Add New Routes**: Create new pages in the app directory.
- **Customize Theme**: Modify the theme provider to change the application's appearance.

Example of extending a service:

```typescript
// services/analytics/AnalyticsProvider.tsx
export function AnalyticsProvider({ children }) {
  const { services } = useFirebase();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Analytics functions
  const trackEvent = async (eventName, eventData) => { /* ... */ };
  const getAnalyticsData = async (metric, timeRange) => { /* ... */ };
  
  return (
    <AnalyticsContext.Provider value={{ 
      analyticsData, loading, error,
      trackEvent, getAnalyticsData
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
```

For more information on extending the architecture, see the [Extending Core Services Guide](./extending-services.md). 