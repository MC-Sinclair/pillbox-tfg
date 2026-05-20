FROM php:8.3-apache-bookworm

RUN apt-get clean && rm -rf /var/lib/apt/lists/* \
    && apt-get update && apt-get install -y --no-install-recommends \
    git zip unzip libzip-dev libonig-dev curl ca-certificates \
    && docker-php-ext-install pdo pdo_mysql zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV NODE_VERSION=20.19.2
RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" \
    | tar -xz -C /usr/local --strip-components=1 \
    --exclude=CHANGELOG.md --exclude=LICENSE --exclude=README.md

RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini

RUN a2dismod mpm_event 2>/dev/null || true && \
    a2enmod mpm_prefork rewrite
RUN sed -i "s/AllowOverride None/AllowOverride All/" /etc/apache2/apache2.conf

EXPOSE 80

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN composer global require laravel/installer
ENV PATH="/root/.composer/vendor/bin:${PATH}"

WORKDIR /var/www/html

COPY . /var/www/html
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN echo "memory_limit=-1" > /usr/local/etc/php/conf.d/docker-php-memlimit.ini \
    && echo "max_execution_time=0" >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini

COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
ENTRYPOINT ["/entrypoint.sh"]