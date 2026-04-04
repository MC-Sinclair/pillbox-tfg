#!/bin/bash
set -e

echo "Configurando permisos..."
# Damos la propiedad a www-data (el usuario de Apache)
chown -R www-data:www-data /var/www/html

# Permisos específicos para Laravel
if [ -d "/var/www/html/pillbox/storage" ]; then
    chmod -R 775 /var/www/html/pillbox/storage /var/www/html/pillbox/bootstrap/cache
fi

echo "Iniciando Apache..."
exec apache2-foreground