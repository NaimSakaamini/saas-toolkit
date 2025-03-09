# Firebase Setup Guide

This guide provides instructions for setting up Firebase for the Naim SaaS Toolkit, including creating the necessary Firestore indexes.

## Setting Up Firestore Indexes

The application requires several composite indexes in Firestore to function properly. You can set these up in two ways:

### Option 1: Deploy Indexes Using Firebase CLI (Recommended)

1. Make sure you have the Firebase CLI installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init
   ```
   - Select "Firestore" when prompted for features
   - Choose your Firebase project
   - Accept the default file locations

4. Deploy the indexes defined in `firestore.indexes.json`:
   ```bash
   firebase deploy --only firestore:indexes
   ```

   Alternatively, you can use the provided script:
   ```bash
   ./scripts/deploy-indexes.sh
   ```

### Option 2: Create Indexes Manually via Console

You can also create the indexes manually by clicking on the links in the error messages or by following these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Click on the "Indexes" tab
5. Click "Add Index"
6. Create the following indexes:

#### Subscriptions Collection
- Collection ID: `subscriptions`
- Fields:
  - `orgId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

#### Invoices Collection
- Collection ID: `invoices`
- Fields:
  - `orgId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

#### Payment Methods Collection
- Collection ID: `paymentMethods`
- Fields:
  - `orgId` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

#### Usage Collection
- Collection ID: `usage`
- Fields:
  - `orgId` (Ascending)
  - `metric` (Ascending)
  - `timestamp` (Descending)
- Query scope: Collection

## Setting Up Subscription Collections

To initialize the subscription system with sample data, you can use the provided setup script:

```bash
./scripts/setup-subscriptions.sh
```

This script will:
1. Create a sample subscription document
2. Create a sample invoice document
3. Create a sample payment method document
4. Create sample usage records for storage, members, and organizations

**Note**: Before running the script, you may want to update the sample organization and user IDs in the `scripts/setup-subscription-collections.js` file with real values from your database.

## Resolving Current Errors

The errors you're seeing are related to missing Firestore indexes. After setting up the indexes as described above, the errors should be resolved. Note that it may take a few minutes for the indexes to be created and become active.

### Error Messages and Their Solutions

1. **Subscription by Organization ID Error**:
   ```
   Error getting subscription by organization ID: FirebaseError: The query requires an index.
   ```
   This is resolved by creating the index on the `subscriptions` collection with `orgId` (Ascending) and `createdAt` (Descending).

2. **Invoices by Organization ID Error**:
   ```
   Error getting invoices by organization ID: FirebaseError: The query requires an index.
   ```
   This is resolved by creating the index on the `invoices` collection with `orgId` (Ascending) and `createdAt` (Descending).

3. **Current Usage Error**:
   ```
   Error getting current usage: FirebaseError: The query requires an index.
   ```
   This is resolved by creating the index on the `usage` collection with `orgId` (Ascending), `metric` (Ascending), and `timestamp` (Descending).

## Additional Firebase Setup

### Authentication

Make sure to enable the authentication methods you plan to use:

1. Go to the Firebase Console
2. Navigate to Authentication > Sign-in method
3. Enable Email/Password and Google Sign-in (or other providers as needed)

### Firestore Rules

Set up appropriate security rules for your Firestore database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Organization rules
    match /organizations/{orgId} {
      allow read: if request.auth != null && exists(/databases/$(database)/documents/users/$(request.auth.uid)/organizations/$(orgId));
      allow write: if request.auth != null && get(/databases/$(database)/documents/organizations/$(orgId)).data.ownerId == request.auth.uid;
    }
    
    // Subscription rules
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null && get(/databases/$(database)/documents/organizations/$(resource.data.orgId)).data.ownerId == request.auth.uid;
      allow write: if request.auth != null && get(/databases/$(database)/documents/organizations/$(request.data.orgId)).data.ownerId == request.auth.uid;
    }
    
    // Add similar rules for other collections
  }
}
```

Customize these rules based on your application's security requirements. 