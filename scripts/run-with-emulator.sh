#!/bin/bash

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

# Create a temporary .env.local.emulator file
cat > .env.local.emulator << EOL
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=demo-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=demo-app-id
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=localhost
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT=9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT=8080
EOL

# Backup the original .env.local if it exists
if [ -f .env.local ]; then
    cp .env.local .env.local.backup
    echo "Backed up original .env.local to .env.local.backup"
fi

# Use the emulator .env file
cp .env.local.emulator .env.local
echo "Using Firebase emulator configuration"

# Start the Firebase emulator in the background
echo "Starting Firebase emulator..."
firebase emulators:start &
EMULATOR_PID=$!

# Wait for the emulator to start
echo "Waiting for emulator to start..."
sleep 5

# Start the Next.js development server
echo "Starting Next.js development server..."
npm run dev

# Clean up when the script is terminated
function cleanup {
    echo "Cleaning up..."
    kill $EMULATOR_PID
    
    # Restore the original .env.local if it exists
    if [ -f .env.local.backup ]; then
        cp .env.local.backup .env.local
        rm .env.local.backup
        echo "Restored original .env.local"
    fi
    
    rm .env.local.emulator
    echo "Cleanup completed"
}

# Register the cleanup function to be called on exit
trap cleanup EXIT 