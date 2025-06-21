FROM node:18-bullseye-slim

# Install Chrome dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
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

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Explicitly install Puppeteer Chromium
RUN npx puppeteer install chrome

COPY . .

RUN npm run build

EXPOSE 3000

# Puppeteer cache directory env variable
ENV PUPPETEER_CACHE_DIR=/tmp/puppeteer_cache

CMD ["npm", "start"]
