# Firebase Service API Reference

This document provides a detailed API reference for the Firebase service in the Naim SaaS Toolkit.

## Table of Contents

1. [Overview](#overview)
2. [FirebaseProvider](#firebaseprovider)
3. [useFirebase Hook](#usefirebase-hook)
4. [Firebase Configuration](#firebase-configuration)
5. [Firebase Services](#firebase-services)
6. [Utility Functions](#utility-functions)
7. [Type Definitions](#type-definitions)
8. [Examples](#examples)

## Overview

The Firebase service is responsible for initializing Firebase and providing access to Firebase services throughout the application. It is implemented as a React context provider (`FirebaseProvider`) and a custom hook (`useFirebase`).

## FirebaseProvider

The `FirebaseProvider` component initializes Firebase and provides Firebase services to its children.

### Import

```typescript
import { FirebaseProvider } from '@/services/firebase/FirebaseProvider';
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | ReactNode | Yes | - | The child components that will have access to Firebase services. |
| `config` | FirebaseConfig | No | - | Firebase configuration object. If not provided, it will try to get the configuration from environment variables. |
| `app` | FirebaseApp | No | - | Pre-initialized Firebase app instance. If provided, it will be used instead of initializing a new one. |
| `auth` | Auth | No | - | Pre-initialized Firebase Auth instance. If provided, it will be used instead of initializing a new one. |
| `db` | Firestore | No | - | Pre-initialized Firestore instance. If provided, it will be used instead of initializing a new one. |

### Usage

```tsx
import { FirebaseProvider } from '@/services/firebase/FirebaseProvider';

// With default configuration from environment variables
function App() {
  return (
    <FirebaseProvider>
      <YourApp />
    </FirebaseProvider>
  );
}

// With custom configuration
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id'
};

function App() {
  return (
    <FirebaseProvider config={firebaseConfig}>
      <YourApp />
    </FirebaseProvider>
  );
}

// With pre-initialized Firebase instances
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      <YourApp />
    </FirebaseProvider>
  );
}
```

## useFirebase Hook

The `useFirebase` hook provides access to Firebase services within components.

### Import

```typescript
import { useFirebase } from '@/services/firebase/FirebaseProvider';
```

### Return Value

The hook returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `services` | FirebaseServices | Object containing Firebase service instances (app, auth, db). |

### Usage

```tsx
import { useFirebase } from '@/services/firebase/FirebaseProvider';

function MyComponent() {
  const { services } = useFirebase();
  const { app, auth, db } = services;
  
  // Use Firebase services
  // ...
  
  return (
    // Your component JSX
  );
}
```

## Firebase Configuration

The Firebase configuration is an object with the following properties:

### FirebaseConfig Interface

```typescript
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}
```

### Environment Variables

If no configuration is provided to the `FirebaseProvider`, it will try to get the configuration from the following environment variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

## Firebase Services

The `FirebaseServices` object contains the following Firebase service instances:

### FirebaseServices Interface

```typescript
interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `app` | FirebaseApp | The Firebase app instance. |
| `auth` | Auth | The Firebase Auth instance. |
| `db` | Firestore | The Firestore instance. |

## Utility Functions

The Firebase service provides several utility functions for working with Firebase:

### getFirebaseConfigFromEnv

Gets the Firebase configuration from environment variables.

```typescript
function getFirebaseConfigFromEnv(): FirebaseConfig | null;
```

#### Return Value

Returns a `FirebaseConfig` object if all required environment variables are set, or `null` otherwise.

#### Usage

```typescript
import { getFirebaseConfigFromEnv } from '@/services/firebase/config';

const config = getFirebaseConfigFromEnv();
if (config) {
  // Use the configuration
} else {
  // Handle missing configuration
}
```

### getFirebaseServices

Gets or initializes Firebase services.

```typescript
function getFirebaseServices(
  config?: FirebaseConfig,
  app?: FirebaseApp,
  auth?: Auth,
  db?: Firestore
): FirebaseServices;
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `config` | FirebaseConfig | No | - | Firebase configuration object. If not provided, it will try to get the configuration from environment variables. |
| `app` | FirebaseApp | No | - | Pre-initialized Firebase app instance. If provided, it will be used instead of initializing a new one. |
| `auth` | Auth | No | - | Pre-initialized Firebase Auth instance. If provided, it will be used instead of initializing a new one. |
| `db` | Firestore | No | - | Pre-initialized Firestore instance. If provided, it will be used instead of initializing a new one. |

#### Return Value

Returns a `FirebaseServices` object containing the Firebase service instances.

#### Usage

```typescript
import { getFirebaseServices } from '@/services/firebase/config';

const services = getFirebaseServices(config);
const { app, auth, db } = services;

// Use Firebase services
```

### initializeFirebase

Initializes Firebase with the provided configuration or environment variables.

```typescript
function initializeFirebase(
  config?: FirebaseConfig,
  app?: FirebaseApp,
  auth?: Auth,
  db?: Firestore
): FirebaseServices;
```

#### Parameters

Same as `getFirebaseServices`.

#### Return Value

Returns a `FirebaseServices` object containing the initialized Firebase service instances.

#### Usage

```typescript
import { initializeFirebase } from '@/services/firebase/config';

const services = initializeFirebase(config);
const { app, auth, db } = services;

// Use Firebase services
```

### resetFirebaseServices

Resets Firebase services by deleting the app instance.

```typescript
function resetFirebaseServices(): void;
```

#### Usage

```typescript
import { resetFirebaseServices } from '@/services/firebase/config';

// Reset Firebase services
resetFirebaseServices();
```

## Type Definitions

### FirebaseConfig

```typescript
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}
```

### FirebaseServices

```typescript
interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}
```

### FirebaseContextType

```typescript
interface FirebaseContextType {
  services: FirebaseServices;
}
```

### FirebaseProviderProps

```typescript
interface FirebaseProviderProps {
  children: ReactNode;
  config?: FirebaseConfig;
  app?: FirebaseApp;
  auth?: Auth;
  db?: Firestore;
}
```

## Examples

### Basic Usage

```tsx
// app/layout.tsx
import { FirebaseProvider } from '@/services/firebase/FirebaseProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
```

### Using Firebase Services in a Component

```tsx
// components/MyComponent.tsx
import { useFirebase } from '@/services/firebase/FirebaseProvider';
import { collection, getDocs } from 'firebase/firestore';

export function MyComponent() {
  const { services } = useFirebase();
  const { db } = services;
  
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'collection-name'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  };
  
  // Use fetchData in your component
  // ...
  
  return (
    // Your component JSX
  );
}
```

### Custom Firebase Configuration

```tsx
// app/layout.tsx
import { FirebaseProvider } from '@/services/firebase/FirebaseProvider';

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider config={firebaseConfig}>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
```

### Using Firebase Emulator

```tsx
// app/layout.tsx
import { FirebaseProvider } from '@/services/firebase/FirebaseProvider';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to Firebase emulators
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider app={app} auth={auth} db={db}>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
``` 