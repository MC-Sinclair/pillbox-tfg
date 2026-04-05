#!/bin/bash
set -e

echo "Configurando permisos de la raíz..."
# Damos la propiedad de todo al usuario de Apache (www-data)
chown -R www-data:www-data /var/www/html

# --- EL CAMBIO ESTÁ AQUÍ ---
# Verificamos si existe la carpeta pillbox y entramos en sus subcarpetas
if [ -d "/var/www/html/pillbox" ]; then
    echo "Ajustando permisos de escritura para Laravel en Pillbox..."
    chmod -R 775 /var/www/html/pillbox/storage
    chmod -R 775 /var/www/html/pillbox/bootstrap/cache
    # Aseguramos que el dueño sea el correcto dentro de la subcarpeta
    chown -R www-data:www-data /var/www/html/pillbox/storage /var/www/html/pillbox/bootstrap/cache
fi

echo "Iniciando Apache..."
exec apache2-foreground