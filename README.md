# PillBox

Plataforma web de gestión de administración farmacológica para residencias de mayores. Desarrollada como Trabajo de Fin de Grado (TFG) del ciclo formativo de Desarrollo de Aplicaciones Web (DAW) en el IES María Moliner, Zaragoza.

**Producción:** [https://pillbox.es](https://pillbox.es)

---

## Stack tecnológico

| Capa                  | Tecnología                                  |
| --------------------- | -------------------------------------------- |
| Backend               | PHP 8.3 · Laravel 13                        |
| Frontend              | React 19 · Inertia.js v3 · Tailwind CSS v4 |
| Base de datos         | MySQL 8.0                                    |
| Autenticación        | Laravel Fortify + 2FA TOTP                   |
| Infraestructura local | Docker · Apache                             |
| Despliegue            | Railway (europe-west4)                       |

---

## Funcionalidades principales

- **Gestión de pautas médicas** — el médico crea tratamientos con medicamento, dosis, vía, horarios y periodo de vigencia
- **Panel de administración diaria** — las gerocultoras registran cada dosis con estado (administrada, rechazada, dificultad) vinculado a usuario y timestamp
- **Generación automática de registros** — al acceder al panel se crean las administraciones del día para todas las pautas activas
- **Historial auditable** — cada acción queda sellada; no editable por personal operativo
- **Gestión de residentes y medicamentos** — catálogo por residencia con control de borrado si hay pautas activas
- **Roles diferenciados** — Admin, Médico y Gerocultor con vistas y permisos separados
- **2FA TOTP** — segundo factor de autenticación obligatorio para todos los roles
- **Multirresidencia** — arquitectura que aísla los datos por sede (`residence_id`)

---

## Esquema de base de datos

```
residences          → id, name
users               → id, name, email, password, role, active, residence_id, 2FA fields
residents           → id, first_name, last_name, room, birth_date, doctor, status, residence_id
medications         → id, name, brand, format, residence_id
prescriptions       → id, resident_id, medication_id, user_id, dose, route, schedules (JSON), start_date, end_date, notes, active
administrations     → id, prescription_id, scheduled_at, administered_at, status, notes, user_id
resident_user       → pivot gerocultoras ↔ residentes
```

**Roles de usuario:** `admin` · `medico` · `gerocultora`

**Estados de administración:** `pending` · `administered` · `refused` · `difficulty` · `missed`

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución
- Git

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/MC-Sinclair/pillbox-tfg.git
cd pillbox-tfg
```

### 2. Configurar variables de entorno

```bash
cp pillbox/.env.example pillbox/.env
```

Editar `pillbox/.env` con los valores del entorno local (ya configurados para Docker por defecto):

```env
APP_NAME=PillBox
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=pillbox
DB_USERNAME=root
DB_PASSWORD=root

ADMIN_EMAIL=admin@pillbox.local
ADMIN_PASSWORD=password
```

> `ADMIN_EMAIL` y `ADMIN_PASSWORD` crean el usuario administrador inicial al arrancar el contenedor.

### 3. Levantar los contenedores

```bash
docker compose up -d --build
```

El `entrypoint.sh` ejecuta automáticamente al primer arranque:

1. `composer install`
2. `npm install && npm run build`
3. `php artisan key:generate`
4. `php artisan config:cache`
5. `php artisan migrate`
6. Creación del usuario admin inicial

### 4. Acceder a la aplicación

| Servicio    | URL                   |
| ----------- | --------------------- |
| Aplicación | http://localhost:8080 |
| phpMyAdmin  | http://localhost:8081 |

### 5. Crear usuarios adicionales

Desde el panel de administración (`/admin/usuarios`) con el usuario admin creado en el paso anterior.

---

## Variables de entorno relevantes

| Variable           | Descripción                                 |
| ------------------ | -------------------------------------------- |
| `APP_KEY`        | Clave de cifrado (generada automáticamente) |
| `APP_URL`        | URL base de la aplicación                   |
| `DB_HOST`        | Host de MySQL (`mysql` en Docker)          |
| `DB_DATABASE`    | Nombre de la base de datos                   |
| `ADMIN_EMAIL`    | Email del administrador inicial              |
| `ADMIN_PASSWORD` | Contraseña del administrador inicial        |

---

## Estructura del proyecto

```
Docker-laravel/
├── docker-compose.yml
├── Dockerfile
├── entrypoint.sh
└── pillbox/                    ← Aplicación Laravel
    ├── app/
    │   ├── Http/Controllers/
    │   │   ├── Admin/          ← UserController, ResidentController, MedicationController
    │   │   ├── Medico/         ← PrescriptionController, HistorialController, MedicationController
    │   │   └── PanelController.php
    │   └── Models/             ← User, Resident, Medication, Prescription, Administration, Residence
    ├── resources/
    │   └── js/
    │       ├── pages/
    │       │   ├── Landing.tsx
    │       │   ├── Legal.tsx
    │       │   ├── Admin/Index.tsx
    │       │   ├── Medico/Pautas.tsx
    │       │   └── Panel/Index.tsx
    │       └── layouts/
    ├── routes/web.php
    └── database/migrations/
```

---

## Rutas principales

| Método | Ruta                     | Rol         | Descripción                        |
| ------- | ------------------------ | ----------- | ----------------------------------- |
| GET     | `/`                    | Público    | Landing page                        |
| GET     | `/legal`               | Público    | Política de privacidad y términos |
| GET     | `/login`               | Público    | Autenticación                      |
| GET     | `/panel`               | gerocultora | Panel de administración diaria     |
| GET     | `/admin/residentes`    | admin       | Gestión de residentes              |
| GET     | `/admin/usuarios`      | admin       | Gestión de usuarios                |
| GET     | `/admin/medicamentos`  | admin       | Catálogo de medicamentos           |
| GET     | `/medico/pautas`       | medico      | Gestión de pautas                  |
| GET     | `/medico/historial`    | medico      | Historial de administraciones       |
| GET     | `/medico/medicamentos` | medico      | Catálogo de medicamentos           |

---

## Despliegue en Railway

La aplicación está configurada para Railway con las siguientes variables de entorno adicionales en producción:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://pillbox.es
APP_TIMEZONE=Europe/Madrid
```

El `entrypoint.sh` gestiona las migraciones y la compilación de assets automáticamente en cada despliegue.

---

## Contexto académico

**Centro:** IES María Moliner — Segovia
**Ciclo:** Desarrollo de Aplicaciones Web (DAW)
**Tipo:** Trabajo de Fin de Grado (TFG)
**GitHub:** [github.com/MC-Sinclair/pillbox-tfg](https://github.com/MC-Sinclair/pillbox-tfg)
**LinkedIn:** [linkedin.com/in/pillb0x](https://www.linkedin.com/in/pillb0x/)
