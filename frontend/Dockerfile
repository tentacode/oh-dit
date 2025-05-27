# Use Node 24 as specified in the stack
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose the development port
EXPOSE 3000

# Start the development server with hot reload
CMD ["npm", "run", "dev"] 