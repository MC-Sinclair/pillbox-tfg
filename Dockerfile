FROM php:8.3-apache

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_mysql zip opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configurar OPcache
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini

# Activar mod_rewrite
RUN a2enmod rewrite
RUN sed -i "s/AllowOverride None/AllowOverride All/" /etc/apache2/apache2.conf

# --- EL CAMBIO CLAVE ---
# En lugar de sed, usamos un comando que solo cambia el puerto si existe la variable.
# Para local, Apache seguirá usando el puerto 80 por defecto.
EXPOSE 80

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instalar instalador de Laravel
RUN composer global require laravel/installer
ENV PATH="/root/.composer/vendor/bin:${PATH}"

WORKDIR /var/www/html

# Copiar archivos
COPY . /var/www/html
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Subir los límites de memoria y tiempo para que el instalador no pete
RUN echo "memory_limit=-1" > /usr/local/etc/php/conf.d/docker-php-memlimit.ini \
    && echo "max_execution_time=0" >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini

ENTRYPOINT ["/entrypoint.sh"]