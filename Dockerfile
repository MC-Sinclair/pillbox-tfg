FROM php:8.3-apache

RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_mysql zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

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