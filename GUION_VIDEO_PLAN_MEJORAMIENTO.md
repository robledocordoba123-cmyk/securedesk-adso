# Guía de grabación — Video técnico (15-20 min)

No es un texto para leer. El plan dice explícitamente "no basta con leer diapositivas": para cada bloque tienes qué mostrar en pantalla y los puntos que debes explicar CON TUS PALABRAS, mirando el código real mientras hablas. Practica cada bloque 1-2 veces en voz alta antes de grabar, sin guion en mano.

Antes de grabar: abre estas cosas y déjalas listas en pestañas/ventanas separadas para no perder tiempo buscando durante la grabación:
- VS Code con el proyecto `SecureDesk-ADSO` abierto
- Terminal en `backend/`
- Navegador en `http://localhost:5500` (frontend) y otra pestaña en tu repo de GitHub
- El documento técnico PDF abierto (para mostrar la matriz de riesgos y hallazgos brevemente)

---

## 0. Intro (0:00 - 0:40)
**Pantalla:** tu cara o el README del repo en GitHub.
**Di:** quién eres (nombre, ficha 3229209), qué competencia es (Seguridad Informática), que este video es la sustentación técnica del plan de mejoramiento, y qué vas a mostrar (el problema, la arquitectura, los controles de seguridad, las pruebas, y una demo en vivo).

## 1. El problema (0:40 - 2:30)
**Pantalla:** el documento PDF, sección 1 "Descripción del sistema".
**Explica:**
- Qué es SecureDesk ADSO y por qué se eligió este tipo de sistema (API de incidentes de seguridad obliga a resolver los mismos problemas que cualquier implantación real: quién entra, qué ve cada rol, cómo se valida lo que llega, cómo se audita, cómo se recupera).
- Menciona brevemente la nota metodológica: clases 1, 2 y 6 se trabajaron conceptualmente sobre RitmoApp (tu proyecto de grado), pero la implementación técnica real es SecureDesk ADSO — sé honesta con esto, no lo escondas, es coherente y está bien documentado.

## 2. Arquitectura (2:30 - 4:30)
**Pantalla:** VS Code, árbol de archivos (`backend/`, `frontend/`).
**Explica:**
- Las 3 capas: backend Node.js/Express, base de datos PostgreSQL con Prisma ORM, frontend HTML/CSS/JS separado que consume la API.
- Abre `backend/src/app.js` y explica el orden de middlewares (cors, json, morgan, rutas, manejo de errores).
- Abre `backend/prisma/schema.prisma` y muestra los modelos `User` e `Incident`, y el enum `Role`.

## 3. Autenticación — JWT (4:30 - 6:30)
**Pantalla:** `backend/src/routes/auth.routes.js` y `backend/src/middlewares/auth.js`.
**Explica:**
- Cómo funciona el login: se recibe email/password, se compara contra el hash con bcrypt, si es válido se firma un JWT con el rol dentro.
- Qué hace `authenticateJWT`: verifica y decodifica el token antes de dejar pasar la petición.
- Menciona el rate limiting en `/auth/login` (lo detallas en el bloque 5, aquí solo lo nombras).
**Demo en vivo:** haz login desde el frontend como `admin@securedesk.local` y muestra el token en las herramientas de desarrollador del navegador (pestaña Network o Application).

## 4. Autorización — RBAC (6:30 - 9:00)
**Pantalla:** `backend/src/middlewares/authorizeRoles.js`.
**Explica:**
- Los tres roles (ADMIN, ANALISTA, CONSULTA) y qué puede hacer cada uno.
- Que la autorización se valida en el backend, no solo ocultando botones en el frontend — esto es clave, dilo explícitamente.
**Demo en vivo:** con el sistema corriendo, muestra las 3 respuestas reales:
1. Sin token a `/admin/ping` → 401
2. Con token de CONSULTA a `/admin/ping` → 403
3. Con token de ADMIN a `/admin/ping` → 200
(Puedes usar Postman, curl, o el navegador — lo importante es que se vea la respuesta real, no una captura vieja.)

## 5. Controles de seguridad (9:00 - 11:30)
**Pantalla:** `backend/src/validators/incident.schema.js`, `backend/src/routes/auth.routes.js` (rate limiter), `backend/src/middlewares/errorHandler.js`.
**Explica cada uno y di si es preventivo, detectivo o correctivo:**
- Validación con Zod (preventivo) — muestra qué pasa si mandas un incidente con datos inválidos (400 con detalle de cada campo).
- Rate limiting (preventivo) — 5 intentos por minuto en el login, contra fuerza bruta.
- Logs con Morgan (detectivo) — cada petición queda registrada.
- Manejo centralizado de errores (correctivo) — respuestas JSON consistentes, sin exponer stack traces.
- Gestión de secretos: `.env` real nunca se sube, solo `.env.example` como plantilla — muéstralo en VS Code y en el `.gitignore`.

## 6. Estructura del código y repositorio (11:30 - 13:00)
**Pantalla:** GitHub, tu repo `securedesk-adso`.
**Muestra:**
- La estructura de carpetas del repo, el README, las dos ramas (`master` y `plan-mejoramiento`).
- El historial de commits.
- Menciona brevemente que el documento técnico completo y las evidencias están en el mismo repo.

## 7. Pruebas ejecutadas y resultados (13:00 - 15:30)
**Pantalla:** carpeta `evidencia/` y, si puedes, la terminal en vivo.
**Explica:**
- Qué pruebas se hicieron (login por rol, 401/403/200, rate limiting, validación Zod, backup y restauración).
**Demo en vivo (la más importante):** ejecuta el ciclo de backup/restauración real:
1. `bash scripts/backup.sh` — muestra que genera el archivo.
2. Borra o modifica un dato a propósito (ej. elimina un incidente desde Prisma Studio o con una consulta).
3. `bash scripts/restore.sh <archivo>.sql` — muestra que los datos vuelven.
Esto demuestra continuidad y recuperación real, no solo en teoría.

## 8. Riesgos pendientes / hallazgos (15:30 - 17:00)
**Pantalla:** documento PDF, sección 21 "Hallazgos".
**Sé honesta y directa — esto es lo que más valoran en seguridad:**
- El `JWT_SECRET` actual es de nivel desarrollo, no de producción.
- No hay HTTPS/TLS configurado — todo corre en HTTP local.
- No se hizo prueba de carga real bajo concurrencia.
- Menciona el plan de corrección con fechas (sección 22 del documento).

## 9. Cierre (17:00 - 18:30)
**Pantalla:** tu cara o el README.
**Di:**
- Un resumen de una frase: qué controles funcionan de verdad y por qué la seguridad depende de que todos trabajen juntos (autenticación + autorización + validación + logs + backups).
- Que el sistema no está listo para producción todavía y por qué (los hallazgos).
- Agradece y menciona que quedas disponible para la sustentación.

---

## Checklist antes de subir el video
- [ ] Duración entre 15 y 20 minutos
- [ ] Se ve tu cara o se escucha tu voz explicando (no solo lectura de texto)
- [ ] Se muestra código real, no solo diapositivas
- [ ] Incluye al menos una demo en vivo contra el backend corriendo (no solo capturas)
- [ ] Mencionas explícitamente qué riesgo o control demuestra cada parte
- [ ] Subir a YouTube como oculto o público
- [ ] Pegar el link en el documento PDF (reemplazar el placeholder "[PENDIENTE]") y en el README
