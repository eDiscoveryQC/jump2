FROM node:18-bullseye-slim

# Install Chromium and dependencies needed for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy package manifest files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port Next.js will run on
EXPOSE 3000

# Set environment variables for Puppeteer
ENV PUPPETEER_CACHE_DIR=/tmp/puppeteer_cache
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium

# Start the Next.js server
CMD ["npm", "start"]
