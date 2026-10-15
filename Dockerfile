FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files and build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Production run
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]
