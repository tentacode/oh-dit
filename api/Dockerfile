FROM php:8.4-fpm

# Install system dependencies including zsh
RUN apt-get update && apt-get install -y \
    curl \
    git \
    libonig-dev \
    libpng-dev \
    libpq-dev \
    libxml2-dev \
    unzip \
    zip \
    zsh

# Install oh-my-zsh for better shell experience
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Set zsh as default shell via environment variable
ENV SHELL=/bin/zsh

# Configure zsh with useful plugins for PHP development
RUN sed -i 's/plugins=(git)/plugins=(git composer symfony docker docker-compose)/' ~/.zshrc

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# PECL extensions (separate)
RUN pecl install redis \
    && docker-php-ext-enable redis

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application code
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port
EXPOSE 8000

# Use Symfony's built-in server
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
