#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
else
  echo "Error: .env.local file not found."
  echo "Please create a .env.local file with your Firebase configuration."
  exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to continue."
    exit 1
fi

# Run the setup script
echo "Setting up subscription collections..."
node scripts/setup-subscription-collections.js

echo "Setup completed."
echo "Note: You may need to update the sample organization and user IDs in the script with real values." 