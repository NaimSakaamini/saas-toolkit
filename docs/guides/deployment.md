# Deployment Guide

This guide provides detailed instructions on how to deploy your Naim SaaS Toolkit-based application to various platforms.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Vercel Deployment](#vercel-deployment)
5. [Netlify Deployment](#netlify-deployment)
6. [AWS Amplify Deployment](#aws-amplify-deployment)
7. [Docker Deployment](#docker-deployment)
8. [Custom Server Deployment](#custom-server-deployment)
9. [Continuous Integration/Continuous Deployment](#continuous-integrationcontinuous-deployment)
10. [Post-Deployment Steps](#post-deployment-steps)
11. [Troubleshooting](#troubleshooting)

## Introduction

Deploying your SaaS application is the final step in making it available to your users. This guide covers various deployment options, from simple platform deployments like Vercel and Netlify to more complex setups using Docker or custom servers.

## Prerequisites

Before deploying your application, ensure you have:

1. **Completed Development**: Your application should be fully developed and tested locally.
2. **Firebase Configuration**: Your Firebase project should be set up and configured.
3. **Environment Variables**: All necessary environment variables should be defined.
4. **Domain Name**: (Optional) A domain name for your application.
5. **Payment Processing**: (If applicable) Stripe or other payment processing services configured.

## Environment Configuration

### Environment Variables

Create a `.env.production` file with your production environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### Build Configuration

Update your `next.config.js` file to include any necessary production configurations:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add any production-specific configurations here
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
```

## Vercel Deployment

[Vercel](https://vercel.com/) is the recommended platform for deploying Next.js applications.

### Steps:

1. **Create a Vercel Account**: Sign up at [vercel.com](https://vercel.com/).

2. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

3. **Connect Your Repository**:
   - Go to the Vercel dashboard
   - Click "Import Project"
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

4. **Configure Project**:
   - Set the framework preset to "Next.js"
   - Add your environment variables from `.env.production`
   - Configure build settings if necessary

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

6. **Custom Domain** (optional):
   - Go to the project settings
   - Click on "Domains"
   - Add your custom domain

### Using Vercel CLI:

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Netlify Deployment

[Netlify](https://www.netlify.com/) is another excellent platform for deploying Next.js applications.

### Steps:

1. **Create a Netlify Account**: Sign up at [netlify.com](https://www.netlify.com/).

2. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

3. **Create a `netlify.toml` file** in your project root:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

4. **Connect Your Repository**:
   - Go to the Netlify dashboard
   - Click "New site from Git"
   - Select your Git provider
   - Select your repository

5. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add your environment variables

6. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your application

7. **Custom Domain** (optional):
   - Go to the site settings
   - Click on "Domain management"
   - Add your custom domain

### Using Netlify CLI:

```bash
# Login to Netlify
netlify login

# Initialize Netlify configuration
netlify init

# Deploy to production
netlify deploy --prod
```

## AWS Amplify Deployment

[AWS Amplify](https://aws.amazon.com/amplify/) provides a set of tools and services for building and deploying full-stack applications.

### Steps:

1. **Create an AWS Account**: Sign up at [aws.amazon.com](https://aws.amazon.com/).

2. **Install AWS Amplify CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   ```

3. **Configure Amplify**:
   ```bash
   amplify configure
   ```

4. **Initialize Amplify in Your Project**:
   ```bash
   amplify init
   ```

5. **Add Hosting**:
   ```bash
   amplify add hosting
   ```

6. **Deploy**:
   ```bash
   amplify publish
   ```

7. **Connect Your Repository** (for CI/CD):
   - Go to the AWS Amplify Console
   - Click "Connect app"
   - Select your Git provider
   - Select your repository
   - Configure build settings
   - Add your environment variables
   - Click "Save and deploy"

## Docker Deployment

For more control over your deployment environment, you can use Docker.

### Create a Dockerfile:

```dockerfile
# Use the official Node.js image as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Create a docker-compose.yml file:

```yaml
version: '3'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
      - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
      - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
```

### Build and run the Docker container:

```bash
# Build the Docker image
docker build -t your-saas-app .

# Run the Docker container
docker run -p 3000:3000 --env-file .env.production your-saas-app
```

### Using docker-compose:

```bash
# Build and run the Docker container
docker-compose up -d
```

## Custom Server Deployment

For deploying to a custom server (e.g., VPS, dedicated server):

### 1. Build your application:

```bash
npm run build
```

### 2. Set up a process manager (PM2):

```bash
# Install PM2
npm install -g pm2

# Start your application with PM2
pm2 start npm --name "your-saas-app" -- start

# Save the PM2 process list
pm2 save

# Set up PM2 to start on server boot
pm2 startup
```

### 3. Set up a reverse proxy (Nginx):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Set up SSL with Let's Encrypt:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Continuous Integration/Continuous Deployment

### GitHub Actions

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI/CD

Create a `.gitlab-ci.yml` file:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
      - node_modules/
      - public/

deploy:
  stage: deploy
  image: node:18-alpine
  script:
    - npm install -g vercel
    - vercel --token $VERCEL_TOKEN --prod
  only:
    - main
```

## Post-Deployment Steps

### 1. Set up Firebase Security Rules

Update your Firestore security rules to secure your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /organizations/{orgId} {
      allow read: if request.auth != null && exists(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
      allow write: if request.auth != null && get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid)).data.role == 'admin';
      
      match /members/{memberId} {
        allow read: if request.auth != null && exists(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
        allow write: if request.auth != null && get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid)).data.role == 'admin';
      }
    }
    
    // Add rules for your custom collections
  }
}
```

### 2. Set up Firebase Authentication

Enable the authentication methods you want to use in the Firebase console.

### 3. Set up Firebase Storage Rules

Update your Firebase Storage rules to secure your files:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /organizations/{orgId}/{allPaths=**} {
      allow read: if request.auth != null && exists(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid));
      allow write: if request.auth != null && get(/databases/$(database)/documents/organizations/$(orgId)/members/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Add rules for your custom storage paths
  }
}
```

### 4. Set up Stripe Webhooks

If you're using Stripe for payments, set up webhooks to handle events:

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL (e.g., `https://yourdomain.com/api/webhooks/stripe`)
4. Select the events you want to listen for (e.g., `payment_intent.succeeded`, `subscription.created`, etc.)
5. Click "Add endpoint"
6. Copy the webhook signing secret and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### 5. Set up Monitoring and Analytics

1. **Firebase Performance Monitoring**:
   - Enable Firebase Performance Monitoring in the Firebase console
   - Add the Firebase Performance Monitoring SDK to your application

2. **Firebase Crashlytics**:
   - Enable Firebase Crashlytics in the Firebase console
   - Add the Firebase Crashlytics SDK to your application

3. **Google Analytics**:
   - Enable Google Analytics in the Firebase console
   - Add the Google Analytics SDK to your application

4. **Uptime Monitoring**:
   - Set up uptime monitoring using a service like [UptimeRobot](https://uptimerobot.com/) or [Pingdom](https://www.pingdom.com/)

## Troubleshooting

### Common Deployment Issues

1. **Environment Variables**:
   - Ensure all environment variables are correctly set in your deployment platform
   - Check for typos in environment variable names

2. **Build Errors**:
   - Check the build logs for errors
   - Ensure all dependencies are installed
   - Verify that your code is compatible with the Node.js version used by your deployment platform

3. **Firebase Configuration**:
   - Verify that your Firebase project is correctly configured
   - Check that your Firebase API keys are correct
   - Ensure that your Firebase security rules are properly set up

4. **Stripe Integration**:
   - Verify that your Stripe API keys are correct
   - Check that your Stripe webhook is correctly configured
   - Ensure that your Stripe webhook secret is correctly set in your environment variables

5. **Custom Domain Issues**:
   - Verify that your DNS records are correctly set up
   - Check that your SSL certificate is valid
   - Ensure that your domain is correctly configured in your deployment platform

### Getting Help

If you encounter issues that you can't resolve, you can:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Check the [Firebase documentation](https://firebase.google.com/docs)
3. Check the [Stripe documentation](https://stripe.com/docs)
4. Ask for help on [Stack Overflow](https://stackoverflow.com/)
5. Open an issue on the [Naim SaaS Toolkit GitHub repository](https://github.com/yourusername/naim-saas-toolkit) 