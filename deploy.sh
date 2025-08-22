#!/bin/bash

# Appointment Scheduler Deployment Script
# This script builds and deploys the application to Railway

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed. Please install it first:"
        echo "npm install -g @railway/cli"
        exit 1
    fi
    print_success "Railway CLI found"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    cd backend
    
    # Clean and build
    ./mvnw clean package -DskipTests
    
    if [ $? -eq 0 ]; then
        print_success "Backend built successfully"
    else
        print_error "Backend build failed"
        exit 1
    fi
    
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    
    # Install dependencies
    pnpm install --frozen-lockfile
    
    # Build
    pnpm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    
    cd ..
}

# Deploy to Railway
deploy_to_railway() {
    print_status "Deploying to Railway..."
    
    # Login to Railway (if not already logged in)
    if ! railway whoami &> /dev/null; then
        print_status "Logging in to Railway..."
        railway login
    fi
    
    # Deploy
    railway up
    
    if [ $? -eq 0 ]; then
        print_success "Deployment completed successfully!"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check prerequisites
    check_railway_cli
    
    # Build applications
    build_backend
    build_frontend
    
    # Deploy
    deploy_to_railway
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Your application is now live on Railway!"
}

# Run main function
main "$@"
