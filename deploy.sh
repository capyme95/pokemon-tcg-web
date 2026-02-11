#!/bin/bash
# Deploy script for Pokemon TCG Web

echo "🚀 Pokemon TCG Web Deploy Script"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
echo "Checking Vercel login status..."
vercel whoami || {
    echo "Please login to Vercel:"
    vercel login
}

# Build
echo ""
echo "Building project..."
npm run build

# Deploy
echo ""
echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployed!"
