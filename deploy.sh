#!/bin/bash

# Deployment script for Wydely WhatsApp Frontend
# Usage: ./deploy.sh [production|staging|development]

set -e

ENVIRONMENT=${1:-production}
API_URL=${EXPO_PUBLIC_API_URL:-http://72.60.100.178:8080}

echo "🚀 Starting deployment for environment: $ENVIRONMENT"
echo "📡 API URL: $API_URL"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Set environment variable
export EXPO_PUBLIC_API_URL=$API_URL

# Build the application
echo "🔨 Building application..."
npx expo export --platform web

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deployment method selection
echo ""
echo "Select deployment method:"
echo "1) Docker"
echo "2) PM2"
echo "3) Nginx (copy files only)"
echo "4) Just build (no deployment)"
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo "🐳 Building Docker image..."
        docker build -t wydely-whatsapp:latest \
            --build-arg EXPO_PUBLIC_API_URL=$API_URL \
            .
        
        echo "🚀 Starting Docker container..."
        docker stop wydely-whatsapp 2>/dev/null || true
        docker rm wydely-whatsapp 2>/dev/null || true
        docker run -d \
            -p 3000:3000 \
            --name wydely-whatsapp \
            --restart unless-stopped \
            wydely-whatsapp:latest
        
        echo "✅ Application deployed! Access at http://localhost:3000"
        ;;
    2)
        if ! command -v pm2 &> /dev/null; then
            echo "📦 Installing PM2..."
            npm install -g pm2
        fi
        
        echo "🚀 Starting application with PM2..."
        pm2 stop wydely-whatsapp 2>/dev/null || true
        pm2 delete wydely-whatsapp 2>/dev/null || true
        pm2 serve dist 3000 --name wydely-whatsapp --spa
        pm2 save
        
        echo "✅ Application deployed! Access at http://localhost:3000"
        echo "📊 View logs: pm2 logs wydely-whatsapp"
        ;;
    3)
        NGINX_DIR=${NGINX_WEB_DIR:-/var/www/html}
        echo "📁 Copying files to $NGINX_DIR..."
        
        if [ ! -d "$NGINX_DIR" ]; then
            echo "❌ Nginx directory not found: $NGINX_DIR"
            echo "   Please set NGINX_WEB_DIR environment variable or create the directory"
            exit 1
        fi
        
        sudo cp -r dist/* $NGINX_DIR/
        echo "✅ Files copied to $NGINX_DIR"
        echo "   Please ensure nginx is configured to serve from this directory"
        ;;
    4)
        echo "✅ Build completed. Files are in dist directory"
        echo "   You can deploy manually or use a different method"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
