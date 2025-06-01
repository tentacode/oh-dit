# Use Node 24 as specified in the stack
FROM node:24-alpine

# Install zsh and oh-my-zsh for better shell experience
RUN apk add --no-cache zsh git curl

# Install oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Set zsh as default shell via environment variable
ENV SHELL=/bin/zsh

# Configure zsh with some useful plugins
RUN sed -i 's/plugins=(git)/plugins=(git node npm docker docker-compose)/' ~/.zshrc

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