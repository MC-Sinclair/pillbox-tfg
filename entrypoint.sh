#!/bin/bash
set -e

echo "Configurando permisos de la raíz..."
chown -R www-data:www-data /var/www/html

if [ -d "/var/www/html/pillbox" ]; then
    cd /var/www/html/pillbox

    echo "Instalando dependencias de Composer..."
    composer install --no-dev --optimize-autoloader --no-interaction

    echo "Instalando dependencias de Node..."
    npm install

    echo "Compilando assets con Vite..."
    npm run build

    echo "Configurando HTTPS..."
    php artisan config:cache

    echo "Ejecutando migraciones..."
    php artisan migrate:fresh --force

    echo "Ajustando permisos de escritura para Laravel en Pillbox..."
    chmod -R 775 /var/www/html/pillbox/storage
    chmod -R 775 /var/www/html/pillbox/bootstrap/cache
    chown -R www-data:www-data /var/www/html/pillbox/storage /var/www/html/pillbox/bootstrap/cache
fi

echo "Desactivando mpm_event en tiempo de ejecucion..."
a2dismod mpm_event 2>/dev/null || true
a2enmod mpm_prefork 2>/dev/null || true

echo "Iniciando Apache..."
exec apache2-foreground