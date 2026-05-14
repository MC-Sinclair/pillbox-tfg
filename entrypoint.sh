#!/bin/bash
set -e

if [ -d "/var/www/html/pillbox" ]; then
    cd /var/www/html/pillbox

    if [ ! -d "vendor" ]; then
        echo "Instalando dependencias de Composer..."
        composer install --no-dev --optimize-autoloader --no-interaction
    fi

    if [ ! -d "node_modules" ]; then
        echo "Instalando dependencias de Node..."
        npm install
    fi

    if [ ! -d "public/build" ]; then
        echo "Compilando assets con Vite..."
        npm run build
    fi

    if [ -z "$APP_KEY" ]; then
        echo "Generando APP_KEY..."
        php artisan key:generate --no-interaction --force
    fi

    echo "Cacheando configuracion..."
    php artisan config:cache

    echo "Ejecutando migraciones..."
    php artisan migrate --force || echo "Migration failed, continuing..."

    echo "Asegurando usuario admin..."
    php artisan tinker --execute="App\Models\User::updateOrCreate(['email' => 'mcaceres@pillbox.com'], ['name' => 'Admin', 'password' => bcrypt('EstrellasOscuras6'), 'role' => 'admin', 'active' => true]);"

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