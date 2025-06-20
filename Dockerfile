# Use official Node.js 18 slim image
FROM node:18-slim

# Install necessary libs for Puppeteer / Chromium
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    wget \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm install

# Copy app source code
COPY . .

# Install Puppeteer browsers
RUN npx puppeteer install

# Build Next.js app
RUN npm run build

# Expose the port Render expects
EXPOSE 3000

# Run the Next.js production server
CMD ["npm", "start"]
