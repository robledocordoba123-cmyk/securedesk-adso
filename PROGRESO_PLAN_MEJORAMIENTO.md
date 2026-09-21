# Progreso — Plan de Mejoramiento Seguridad Informática (Ficha 3229209)

Aprendiz: Manuela Córdoba Robledo (1015071897)
Competencia: Seguridad Informática — Nota actual 69.2/100, mínimo 70
Este archivo se actualiza cada vez que avanzamos algo, para poder retomar el trabajo aunque se cierre la sesión.

## Fechas
- Correo recibido: 20 sept 2026
- Fecha límite: por confirmar (correo contradice 1 vs 2 de octubre) — mensaje enviado al instructor Gustavo Bolaños el 20 sept, esperando respuesta.

## Los 4 entregables del plan y su estado

### 1. Documento técnico PDF único (30%)
- Estado: **pendiente de ensamblar**
- Ya existe el contenido repartido en:
  - `Documents/Seguridad Informatica/SecureDesk-ADSO/Dossier_Evidencias_Practicas_Seguridad_Informatica_Clases_1_a_6.docx`
  - `Documents/Seguridad Informatica/Informe_Verificacion_Preproduccion_SecureDesk_ADSO.docx` (clase 7)
  - `Documents/Seguridad Informatica/Plan_Implantacion_Segura_SecureDesk_ADSO_Clase08.docx` (clase 8)
  - Documentos de RitmoApp (clases 1, 2, 6 — conceptuales, según lo aclarado en el doc de clase 8)
- Falta: consolidar todo en un solo PDF con portada, tabla de contenido, versión/fecha y las secciones que pide la guía.

### 2. Repositorio GitHub (15%)
- Estado: **en progreso**
- No existía `.git` en el proyecto al 20 sept.
- Falta: git init, .gitignore, README con instrucciones reales, confirmar que `.env` no se suba (solo `.env.example`), rama/etiqueta `plan-mejoramiento`, subir a GitHub (necesita cuenta/autenticación de Manuela — `gh` CLI no está instalado/autenticado en esta máquina).

### 3. Video YouTube 15-20 min (30%)
- Estado: **no iniciado**

### 4. Sustentación individual (25%)
- Estado: **pendiente de agendar**

## Lo que ya existe y es evidencia real (verificado)
Proyecto en `Documents/Seguridad Informatica/SecureDesk-ADSO/`:
- Backend Node.js/Express + PostgreSQL/Prisma funcional: JWT, RBAC (ADMIN/ANALISTA/CONSULTA), validación Zod, rate limiting, logs Morgan, manejo de errores.
- Scripts de backup/restore (`backend/scripts/backup.sh`, `restore.sh`) + backup real generado.
- Carpeta `evidencia/`: capturas y salidas de pruebas reales (login por rol, 403/200, rate limit, validación Zod, backup→daño→restore, etc.)

## Próximos pasos inmediatos
1. Inicializar git en `SecureDesk-ADSO/`, crear `.gitignore`, README real.
2. Confirmar fecha límite con el instructor.
3. Consolidar el documento PDF.
4. Grabar el video.
