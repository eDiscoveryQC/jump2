# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of app source code
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Copy built app and node_modules from builder stage
COPY --from=builder /app ./

# Expose port the app will run on
EXPOSE 3000

# Set environment variable (optional, you can also set in Render dashboard)
ENV NODE_ENV=production

# Start Next.js in production mode
CMD ["npm", "start"]
