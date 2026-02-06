# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install

# Copy source files
COPY shared ./shared
COPY client ./client
COPY tsconfig.base.json ./

# Build shared package
WORKDIR /app/shared
RUN npm run build

# Build client
WORKDIR /app/client

ARG VITE_API_URL=/api
ARG VITE_SOCKET_URL=

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy nginx config
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
