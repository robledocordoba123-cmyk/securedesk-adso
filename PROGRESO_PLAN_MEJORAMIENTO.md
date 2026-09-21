# Progreso — Plan de Mejoramiento Seguridad Informática (Ficha 3229209)

Aprendiz: Manuela Córdoba Robledo (1015071897)
Competencia: Seguridad Informática — Nota actual 69.2/100, mínimo 70
Este archivo se actualiza cada vez que avanzamos algo, para poder retomar el trabajo aunque se cierre la sesión.

## Fechas
- Correo recibido: 20 sept 2026
- Fecha límite: por confirmar (correo contradice 1 vs 2 de octubre) — mensaje enviado al instructor Gustavo Bolaños el 20 sept, esperando respuesta.

## Los 4 entregables del plan y su estado

### 1. Documento técnico PDF único (30%)
- Estado: **COMPLETO** ✅
- Archivo: `SecureDesk-ADSO/Documento_Tecnico_Plan_Mejoramiento_SecureDesk_ADSO.docx` y su versión `.pdf` (16 páginas), generados el 21 sept.
- Incluye las 24 secciones que pide el plan (portada, TOC, descripción, alcance, arquitectura, activos, amenazas, vulnerabilidades, matriz de riesgos, CIA, autenticación, RBAC, JWT/Bcrypt, gestión de secretos, controles preventivos/detectivos/correctivos, usuarios, backups, restauración, continuidad, RTO/RPO, reversa, pruebas de seguridad, checklist preproducción, hallazgos, correcciones, conclusiones, referencias), con evidencia real (capturas de `evidencia/`, salidas de terminal reales, tablas reutilizadas de los docs de clase 7 y 8) y sin contenido inventado.
- Pendiente menor: cuando el video esté grabado y la sustentación agendada, actualizar los dos placeholders "[PENDIENTE]" en la portada y en la sección de Referencias con los enlaces/fecha reales.
- Nota técnica: el primer intento de generación produjo un .docx corrupto por un bug de código (arrays sin `spread` al insertar párrafos) — se detectó porque Word se negaba a abrirlo, se depuró por bisección y se corrigió. El archivo final se verificó abriéndolo con Word y revisando visualmente el PDF resultante.

### 2. Repositorio GitHub (15%)
- Estado: **COMPLETO** ✅
- URL: https://github.com/robledocordoba123-cmyk/securedesk-adso (público)
- Hecho el 21 sept:
  - `git init`, `.gitignore` (excluye `node_modules/`, `*.log`, `backend/.env`, `backend/backups/*.sql`, `~$*.docx`, y `evidencia/admin_token.txt`/`consulta_token.txt` por buena práctica — no publicar JWT crudos aunque hayan expirado)
  - `README.md` real y específico (arquitectura, roles, endpoints, instalación, usuarios de prueba, backup/restore)
  - Commit inicial (59 archivos) en rama `master`, subido a GitHub
  - Rama `plan-mejoramiento` creada y subida (la pide el plan explícitamente)
- Pendiente menor: cuando el documento PDF y el video estén listos, actualizar el README con sus enlaces (hay placeholders "(pendiente)" ahí mismo).

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
