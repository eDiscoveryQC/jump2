#!/bin/bash

# Update package lists
apt-get update

# Install Chromium browser needed by Puppeteer
apt-get install -y chromium-browser

# Install Node dependencies
npm install

# Build the Next.js app
npm run build
