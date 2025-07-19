#!/bin/bash

# Build script for MedVault Frontend
echo "🚀 Starting MedVault Frontend Build..."

# Navigate to client directory
cd client

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build completed successfully!"
