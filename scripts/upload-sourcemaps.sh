#!/bin/bash

# Script to upload source maps to Sentry after build
# This should be run as part of your deployment process

# Exit on error
set -e

echo "Uploading source maps to Sentry..."

# Frontend source maps
if [ -d "dist" ]; then
  echo "Uploading frontend source maps..."
  npx @sentry/cli releases files "$RELEASE_VERSION" upload-sourcemaps ./dist \
    --url-prefix "~/" \
    --rewrite \
    --org "$SENTRY_ORG" \
    --project "$SENTRY_PROJECT_FRONTEND"
  
  echo "Cleaning up frontend source maps from production build..."
  find ./dist -name "*.map" -type f -delete
fi

# Backend source maps
if [ -d "backend/dist" ]; then
  echo "Uploading backend source maps..."
  cd backend
  npx @sentry/cli releases files "$RELEASE_VERSION" upload-sourcemaps ./dist \
    --url-prefix "~/" \
    --rewrite \
    --org "$SENTRY_ORG" \
    --project "$SENTRY_PROJECT_BACKEND"
  
  echo "Cleaning up backend source maps from production build..."
  find ./dist -name "*.map" -type f -delete
  cd ..
fi

echo "Source maps uploaded successfully!"