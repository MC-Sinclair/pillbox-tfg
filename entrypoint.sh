#!/bin/bash
set -e

echo "Configurando permisos..."
chown -R www-data:www-data /var/www/html

# Si ya existe Laravel, ajustamos storage
if [ -d "/var/www/html/storage" ]; then
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
fi

echo "Iniciando Apache..."
exec apache2-foreground