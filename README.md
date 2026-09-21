# SecureDesk ADSO

API para gestión de incidentes de seguridad, desarrollada como proyecto práctico de la competencia **Seguridad Informática** (RA 01 — Planear actividades de implantación del software), ficha 3229209, Tecnología en Análisis y Desarrollo de Software (ADSO) — SENA.

Aprendiz: Manuela Córdoba Robledo (1015071897)

> Este repositorio corresponde al plan de mejoramiento de la competencia Seguridad Informática. Ver rama/etiqueta `plan-mejoramiento`.

## Descripción

SecureDesk ADSO permite registrar, listar y clasificar incidentes de seguridad (por severidad y estado), con control de acceso diferenciado según el rol del usuario. Se construyó como sistema de práctica para aplicar de forma controlada los principios de implantación segura: autenticación, autorización, validación de entradas, trazabilidad y respaldo/restauración.

- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL, administrada con Prisma ORM
- **Frontend:** HTML/CSS/JavaScript plano (`frontend/`), consume la API

## Arquitectura y controles implementados

| Control | Implementación |
|---|---|
| Autenticación | JWT (`jsonwebtoken`), login en `/auth/login` |
| Autorización (RBAC) | Middleware `authorizeRoles()` sobre roles `ADMIN`, `ANALISTA`, `CONSULTA` |
| Hash de contraseñas | `bcryptjs` |
| Validación de entradas | Esquemas Zod (`src/validators/`) + saneo manual (`src/lib/sanitize.js`) |
| Rate limiting | `express-rate-limit` en el login (mitiga fuerza bruta) |
| Trazabilidad | Logs de acceso con Morgan (`combined`) |
| Enmascaramiento de datos sensibles | El correo del reportero de un incidente se oculta a roles distintos de `ADMIN` |
| Manejo centralizado de errores | `src/middlewares/errorHandler.js` |
| Backup / restauración | `scripts/backup.sh` y `scripts/restore.sh` sobre PostgreSQL |

## Roles y permisos

| Rol | Puede |
|---|---|
| `ADMIN` | Todo: gestionar usuarios (activar/desactivar), ver correos sin enmascarar, crear y listar incidentes |
| `ANALISTA` | Crear y listar incidentes (correo del reportero enmascarado) |
| `CONSULTA` | Solo listar incidentes (correo del reportero enmascarado) |

## Endpoints principales

- `GET /health` — chequeo de disponibilidad del servicio
- `POST /auth/login` — autenticación, devuelve JWT (con rate limit)
- `GET /admin/ping` — solo `ADMIN`, verifica acceso administrativo
- `GET /users` — solo `ADMIN`, lista usuarios
- `PATCH /users/:id/activate` / `PATCH /users/:id/deactivate` — solo `ADMIN`
- `POST /incidents` — `ADMIN` y `ANALISTA`
- `GET /incidents` — `ADMIN`, `ANALISTA`, `CONSULTA`

## Instalación y ejecución local

Requisitos: Node.js 18+, PostgreSQL corriendo localmente (o accesible por red).

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tu propia cadena de conexión a PostgreSQL y un JWT_SECRET real
npx prisma migrate deploy
npm run seed     # crea usuarios y datos de prueba
npm run dev      # levanta el servidor en http://localhost:4000
```

### Usuarios de prueba (creados por `npm run seed`)

| Email | Password | Rol |
|---|---|---|
| admin@securedesk.local | Sena2026! | ADMIN |
| analista@securedesk.local | Sena2026! | ANALISTA |
| consulta@securedesk.local | Sena2026! | CONSULTA |

Estas son credenciales de prueba para el entorno de desarrollo, no representan usuarios reales.

## Backup y restauración

```bash
cd backend
bash scripts/backup.sh     # genera un dump en backend/backups/
bash scripts/restore.sh <archivo_de_backup>.sql
```

El procedimiento se probó de forma real: se generó un backup, se simuló daño sobre los datos, y se restauró desde el backup, verificando que los datos volvieron al estado previo (evidencia en `evidencia/p6_*.txt`).

## Evidencias de pruebas

En la carpeta `evidencia/` se documentan pruebas reales ejecutadas contra el sistema corriendo: login por rol, acceso denegado (403) sin permisos suficientes, rate limiting activado, validación Zod rechazando datos inválidos (400), logs de Morgan, y el ciclo completo de backup/daño/restauración.

## Documentación completa

El análisis de riesgos, la matriz de riesgos, el plan de implantación segura y el informe de verificación preproducción de este sistema están consolidados en el documento técnico entregado junto con este repositorio para la competencia Seguridad Informática.

- Documento técnico consolidado (PDF): [`Documento_Tecnico_Plan_Mejoramiento_SecureDesk_ADSO.pdf`](./Documento_Tecnico_Plan_Mejoramiento_SecureDesk_ADSO.pdf)
- Video técnico: _(enlace pendiente)_

## Seguridad: manejo de secretos

Las credenciales reales de base de datos y el secreto JWT viven únicamente en `backend/.env`, que **no se sube al repositorio** (ver `.gitignore`). Se incluye `backend/.env.example` como plantilla sin valores reales.
