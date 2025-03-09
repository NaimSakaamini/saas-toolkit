#!/bin/bash

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in to Firebase
firebase projects:list &> /dev/null
if [ $? -ne 0 ]; then
    echo "You are not logged in to Firebase. Please log in."
    firebase login
fi

# Deploy Firestore indexes
echo "Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

echo "Indexes deployment completed."
echo "Note: It may take a few minutes for the indexes to be created and become active."
echo "You can check the status of your indexes in the Firebase console." 