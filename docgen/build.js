const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, ImageRun, AlignmentType, BorderStyle, PageBreak, ExternalHyperlink
} = require('docx');

const ROOT = path.resolve(__dirname, '..');
const EV = path.join(ROOT, 'evidencia');

function readEv(name) {
  return fs.readFileSync(path.join(EV, name), 'utf8').trim();
}

function wrapLine(line, width) {
  if (line.length <= width) return [line];
  const out = [];
  let rest = line;
  while (rest.length > width) {
    let cut = rest.lastIndexOf(' ', width);
    if (cut <= 0) cut = width;
    out.push(rest.slice(0, cut));
    rest = rest.slice(cut).replace(/^ /, '');
  }
  if (rest.length) out.push(rest);
  return out;
}

function codeBlock(text, maxLines) {
  let lines = text.split('\n');
  if (maxLines && lines.length > maxLines) {
    const head = lines.slice(0, Math.max(maxLines - 3, 1));
    const tail = lines.slice(-2);
    lines = [...head, '...', ...tail];
  }
  lines = lines.flatMap((l) => wrapLine(l, 92));
  return new Table({
    width: { size: 9350, type: WidthType.DXA },
    columnWidths: [9350],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9350, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: '0F172A' },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
            children: lines.map((l) => new Paragraph({
              children: [new TextRun({ text: l.length ? l : ' ', font: 'Consolas', size: 16, color: 'E2E8F0' })],
              spacing: { after: 0 },
            })),
          }),
        ],
      }),
    ],
  });
}

function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
}
function h3(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } });
}
function p(text, opts = {}) {
  return new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 150 } });
}
function pb(label, text) {
  return new Paragraph({
    children: [new TextRun({ text: label, bold: true }), new TextRun({ text })],
    spacing: { after: 150 },
  });
}
function bullet(text) {
  return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 60 } });
}
function figureCaption(text) {
  return new Paragraph({
    children: [new TextRun({ text, italics: true, size: 20, color: '475569' })],
    spacing: { after: 250 },
  });
}
function imageFromFile(file, widthPx) {
  const filePath = path.join(EV, file);
  const buf = fs.readFileSync(filePath);
  // real dimensions of our chrome screenshots: 1510x812
  const h = Math.round((widthPx * 812) / 1510);
  return new Paragraph({
    children: [new ImageRun({ data: buf, transformation: { width: widthPx, height: h }, type: 'jpg' })],
    spacing: { after: 80 },
  });
}

function simpleTable(headers, rows, widths) {
  const totalWidth = 9350;
  const colWidths = widths || headers.map(() => Math.floor(totalWidth / headers.length));
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((hText, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: '1E293B' },
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: hText, bold: true, color: 'FFFFFF', size: 18 })] })],
    })),
  });
  const bodyRows = rows.map((r) => new TableRow({
    children: r.map((cellText, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: String(cellText), size: 18 })] })],
    })),
  }));
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...bodyRows],
  });
}

// ---------- Evidence text ----------
const p1_health = readEv('p1_health.txt');
const p1_estructura = readEv('p1_estructura_archivos.txt');
const p3_sin_token = readEv('p3_sin_token.txt');
const p3_login_admin = readEv('p3_login_admin.txt');
const p3_403 = readEv('p3_403.txt');
const p3_200 = readEv('p3_200.txt');
const p4_zod = readEv('p4_zod_400.txt');
const p4_rate = readEv('p4_rate_limit.txt');
const p4_404 = readEv('p4_404.txt');
const p4_morgan = readEv('p4_morgan_log.txt');
const p5_create = readEv('p5_create_incident.txt');
const p5_mask_consulta = readEv('p5_mask_consulta.txt');
const p5_mask_admin = readEv('p5_mask_admin.txt');
const p6_users = readEv('p6_users_list.txt');
const p6_deactivate = readEv('p6_deactivate.txt');
const p6_login_desactivado = readEv('p6_login_desactivado.txt');
const p6_activate = readEv('p6_activate.txt');
const p6_backup = readEv('p6_backup.txt');
const p6_backup_contenido = readEv('p6_backup_contenido.txt');
const p6_antes = readEv('p6_antes_restore.txt');
const p6_dano = readEv('p6_dano_simulado.txt');
const p6_restore = readEv('p6_restore.txt');
const p6_despues = readEv('p6_despues_restore.txt');
const envExample = fs.readFileSync(path.join(ROOT, 'backend', '.env.example'), 'utf8').trim();
const schemaPrisma = fs.readFileSync(path.join(ROOT, 'backend', 'prisma', 'schema.prisma'), 'utf8').trim();

const NOTE_TEXT = 'Nota metodológica sobre las capturas: las evidencias de frontend y base de datos (Prisma Studio) son capturas reales de navegador. Las evidencias de terminal (peticiones curl, logs de Morgan, backup y restauración con pg_dump/psql) se presentan como salida de consola en texto real y legible, copiada directamente del terminal donde se ejecutaron los comandos contra el backend en ejecución (http://localhost:4001) y el contenedor Docker "securedesk_db", en lugar de una imagen rasterizada, para garantizar que el contenido sea exacto y verificable.';

const sections = [];

// ---------------- PORTADA ----------------
sections.push(
  new Paragraph({ text: '', spacing: { before: 1800 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'DOSSIER DE EVIDENCIAS PRÁCTICAS', bold: true, size: 40, color: '0F172A' })],
    spacing: { after: 200 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Seguridad Informática — Clases 1 a 6', bold: true, size: 30, color: '334155' })],
    spacing: { after: 800 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Proyecto práctico: SecureDesk ADSO', italics: true, size: 26, color: '0EA5E9' })],
    spacing: { after: 1200 },
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Aprendiz: Manuela Córdoba Robledo', size: 24 })], spacing: { after: 120 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ficha: 3229209', size: 24 })], spacing: { after: 120 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Programa: Tecnología en Análisis y Desarrollo de Software (ADSO) — SENA', size: 24 })], spacing: { after: 120 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Competencia: Seguridad Informática — RA 01', size: 24 })], spacing: { after: 120 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Instructor: Gustavo Bolaños', size: 24 })], spacing: { after: 120 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: 20 de septiembre de 2026', size: 24 })], spacing: { after: 120 } }),
  new Paragraph({ children: [new PageBreak()] }),
);

// ---------------- INTRODUCCIÓN ----------------
sections.push(
  h2('1. Introducción'),
  p('SecureDesk ADSO es el proyecto práctico de referencia definido para la competencia de Seguridad Informática, usado para aplicar de forma controlada los principios de implantación segura de software (RA 01) sobre un sistema pequeño pero realista: una API para la gestión de incidentes de seguridad. Se eligió este tipo de sistema porque obliga a resolver, en un solo backend, los mismos problemas que aparecen en cualquier implantación real: quién puede entrar, qué puede ver cada rol, cómo se valida y se limpia lo que entra por la API, cómo se deja rastro de lo que pasa, y cómo se recupera el sistema si algo sale mal.'),
  p('El sistema construido para este dossier está formado por un backend en Node.js/Express con base de datos PostgreSQL administrada mediante Prisma ORM, y un frontend separado (HTML/CSS/JavaScript) que consume la API. Implementa autenticación con JSON Web Tokens (JWT), control de acceso basado en roles (ADMIN, ANALISTA y CONSULTA) mediante un middleware authorizeRoles(), validación de datos con Zod, limitación de tasa (rate limiting) en el login, trazabilidad con Morgan, manejo centralizado de errores, un modelo Incident protegido con enmascaramiento de datos sensibles según el rol, gestión de usuarios (activar/desactivar) y un flujo real de backup y restauración de PostgreSQL con pg_dump/psql.'),
  p('Cada práctica de este documento incluye el objetivo de seguridad trabajado, los archivos intervenidos, las pruebas ejecutadas contra el sistema en ejecución, la evidencia obtenida (capturas de navegador y salidas de terminal reales) y una reflexión sobre el riesgo que se está mitigando.'),
  new Paragraph({ children: [new TextRun({ text: NOTE_TEXT, italics: true, size: 19, color: '64748B' })], spacing: { after: 300 } }),
);

// ---------------- PRACTICA 1 ----------------
sections.push(
  h2('2. Práctica 1 — Base técnica del proyecto SecureDesk ADSO'),
  h3('Objetivo práctico'),
  p('Establecer la separación entre frontend y backend, dejar el backend Express configurado con sus variables de entorno, y exponer un endpoint de salud (/health) que permita verificar que el servicio está activo antes de construir el resto de los controles. Desde este punto se identifican los activos iniciales a proteger: código fuente, credenciales, variables de entorno, datos, logs, infraestructura y puertos de servicio.'),
  h3('Archivos intervenidos'),
  bullet('backend/src/app.js — configuración principal de Express (CORS, límite de payload JSON, Morgan, montaje de rutas, manejo de errores).'),
  bullet('backend/src/server.js — arranque del servidor y puerto de escucha.'),
  bullet('backend/src/routes/health.routes.js — endpoint de salud GET /health.'),
  bullet('backend/.env y backend/.env.example — variables de entorno (cadena de conexión a PostgreSQL, JWT_SECRET, puerto).'),
  bullet('backend/prisma/schema.prisma — definición inicial del modelo de datos.'),
  bullet('frontend/index.html — interfaz separada del backend, que consume la API por HTTP.'),
  h3('Activos identificados en esta práctica'),
  bullet('Código fuente del backend y frontend (repositorio local del proyecto).'),
  bullet('Credenciales y secretos: JWT_SECRET y credenciales de la base de datos, aislados en .env (nunca en el código ni en el repositorio).'),
  bullet('Variables de entorno por ambiente (.env.example como plantilla pública sin valores reales).'),
  bullet('Datos: base de datos PostgreSQL "securedesk" en un contenedor Docker dedicado.'),
  bullet('Logs de acceso y auditoría (generados por Morgan en la Práctica 4).'),
  bullet('Infraestructura: contenedor PostgreSQL y puertos de servicio (4001 para la API, 5433 para PostgreSQL, 5500 para el frontend).'),
  h3('Pruebas realizadas y resultado'),
  p('Se levantó el backend y se consultó el endpoint de salud para confirmar que el servicio está activo:'),
  codeBlock(p1_health),
  figureCaption('Salida real de "curl -i http://localhost:4001/health": respuesta 200 OK, confirma que el backend está activo y responde en JSON.'),
  p('Estructura de archivos separando backend y frontend, y las variables de entorno de ejemplo (sin secretos reales):'),
  codeBlock(p1_estructura, 30),
  codeBlock(envExample),
  figureCaption('.env.example: plantilla de variables de entorno publicada en el repositorio; el archivo .env real con los valores efectivos nunca se versiona.'),
  h3('Reflexión de seguridad'),
  p('Separar el .env real de su plantilla pública y exponer un endpoint de salud simple, sin datos sensibles, evita dos errores comunes de implantación: subir credenciales al repositorio y no tener una forma rápida de verificar si el servicio está realmente disponible. Pensar en los activos (código, credenciales, datos, logs, infraestructura, puertos) desde este primer paso permite decidir, antes de escribir el resto del sistema, qué información nunca debe salir del servidor y qué sí puede exponerse públicamente.'),
);

// ---------------- PRACTICA 2 ----------------
const p2Headers = ['Activo', 'Amenaza', 'Vulnerabilidad', 'Impacto', 'Probabilidad', 'Nivel de riesgo', 'Control propuesto'];
const p2Rows = [
  ['Credenciales JWT_SECRET', 'Robo o filtración del secreto de firma', 'Secreto hardcodeado en el código o subido al repositorio', 'Alto — permitiría falsificar tokens de cualquier rol', 'Media', 'Alto', 'JWT_SECRET solo en .env, nunca en el código; .env excluido del control de versiones'],
  ['Ruta administrativa /admin y /users', 'Escalamiento de privilegios', 'Falta de validación de rol en el backend (confiar solo en el frontend)', 'Alto — un CONSULTA podría actuar como ADMIN', 'Media', 'Alto', 'Middleware authorizeRoles() obligatorio en cada ruta administrativa (Práctica 3)'],
  ['Endpoint /auth/login', 'Ataque de fuerza bruta a credenciales', 'Ausencia de límite de intentos', 'Alto — puerta de entrada a todo el sistema', 'Alta', 'Crítico', 'express-rate-limit (5 intentos/minuto) en /auth/login (Práctica 4)'],
  ['Datos recibidos en /incidents', 'Inyección de datos malformados o payloads maliciosos', 'Falta de validación/sanitización de entradas', 'Medio — datos corruptos o scripts almacenados', 'Media', 'Medio', 'Validación con Zod + sanitización de strings antes de persistir (Práctica 4 y 5)'],
  ['Correo del reportero en Incident', 'Exposición de datos personales a roles sin necesidad de verlos', 'Falta de enmascaramiento de datos sensibles por rol', 'Medio — expone información personal innecesariamente', 'Alta', 'Alto', 'Enmascaramiento de reporterEmail para roles distintos de ADMIN (Práctica 5)'],
  ['Base de datos PostgreSQL "securedesk"', 'Pérdida o corrupción de datos (error humano, migración fallida)', 'Ausencia de copias de respaldo verificadas', 'Alto — pérdida total de incidentes y usuarios registrados', 'Baja', 'Alto', 'Backups con pg_dump y prueba real de restauración con psql (Práctica 6)'],
  ['Cuentas de usuario', 'Uso continuo de una cuenta comprometida o de un ex-usuario', 'Falta de mecanismo para desactivar accesos', 'Medio — acceso indebido sostenido en el tiempo', 'Media', 'Medio', 'Endpoints administrativos activate/deactivate + verificación de isActive en login (Práctica 6)'],
];
sections.push(
  h2('3. Práctica 2 — Análisis de activos, amenazas, vulnerabilidades y riesgos'),
  h3('Objetivo práctico'),
  p('Pasar del diagnóstico inicial de la Práctica 1 a identificar formalmente qué puede salir mal en SecureDesk ADSO, por qué puede pasar, y qué control mitiga cada riesgo antes de seguir construyendo funcionalidades.'),
  h3('Matriz de riesgos de implantación'),
  simpleTable(p2Headers, p2Rows, [1300, 1500, 1500, 1300, 1050, 1100, 1600]),
  new Paragraph({ text: '', spacing: { after: 200 } }),
  h3('Reflexión de seguridad'),
  p('El riesgo más crítico identificado es la ausencia de límite de intentos en /auth/login, porque es la puerta de entrada a todos los demás activos: si un atacante puede probar contraseñas sin restricción, cualquier otro control (RBAC, enmascaramiento, validación) pierde valor si logra entrar como ADMIN. Por eso ese control se prioriza en la Práctica 4. El segundo grupo de riesgos más relevante es el que depende de que la validación de permisos se haga en el backend y no solo en la interfaz, que es exactamente lo que se resuelve con RBAC en la Práctica 3.'),
);

// ---------------- PRACTICA 3 ----------------
sections.push(
  h2('4. Práctica 3 — Control de acceso por rol (RBAC)'),
  h3('Objetivo práctico'),
  p('Implementar autenticación con JWT y autorización basada en tres roles (ADMIN, ANALISTA, CONSULTA) mediante un middleware authorizeRoles(), proteger una ruta administrativa y demostrar las respuestas 401, 403 y 200 según el caso, además de mostrar en el frontend permisos visibles según el rol autenticado.'),
  h3('Archivos intervenidos'),
  bullet('backend/src/middlewares/auth.js — middleware authenticateJWT (verifica y decodifica el token).'),
  bullet('backend/src/middlewares/authorizeRoles.js — middleware authorizeRoles(...roles) reutilizable.'),
  bullet('backend/src/routes/auth.routes.js — POST /auth/login, emite el JWT con el rol del usuario.'),
  bullet('backend/src/routes/admin.routes.js — ruta administrativa protegida GET /admin/ping (solo ADMIN).'),
  bullet('backend/prisma/schema.prisma — enum Role (ADMIN, ANALISTA, CONSULTA) en el modelo User.'),
  bullet('frontend/index.html — panel administrativo que solo se muestra si el rol autenticado es ADMIN.'),
  h3('Pruebas de autenticación y autorización'),
  pb('Prueba 1 — Sin token: ', 'acceso a /admin/ping sin cabecera Authorization.'),
  codeBlock(p3_sin_token),
  figureCaption('Resultado: 401 Unauthorized, "Token no proporcionado". El middleware authenticateJWT bloquea cualquier petición sin token antes de llegar al controlador.'),
  pb('Prueba 2 — Login válido: ', 'obtención del JWT para el usuario ADMIN.'),
  codeBlock(p3_login_admin),
  figureCaption('El token JWT incluye el claim "role" (ADMIN), que es lo que valida authorizeRoles() en cada ruta protegida.'),
  pb('Prueba 3 — Rol no autorizado: ', 'un usuario CONSULTA intenta acceder a /admin/ping.'),
  codeBlock(p3_403),
  figureCaption('Resultado: 403 Forbidden. El token es válido (pasó authenticateJWT), pero authorizeRoles("ADMIN") rechaza el rol CONSULTA.'),
  pb('Prueba 4 — Acceso autorizado: ', 'el usuario ADMIN accede a la misma ruta.'),
  codeBlock(p3_200),
  figureCaption('Resultado: 200 OK. Mismo endpoint, mismo middleware; la única diferencia es el rol dentro del token.'),
  h3('Capturas del frontend — permisos visibles según rol'),
  imageFromFile('cap_p3_dashboard_admin.jpg', 480),
  figureCaption('Sesión como ADMIN (admin@securedesk.local): se ve el badge de rol ADMIN, la lista completa de incidentes con el correo del reportero sin enmascarar, y el panel administrativo de usuarios con la acción de activar/desactivar.'),
  imageFromFile('cap_p3_dashboard_consulta.jpg', 480),
  figureCaption('Sesión como CONSULTA (consulta@securedesk.local): el panel administrativo no se muestra en absoluto (el frontend oculta lo que el rol no puede usar) y el correo del reportero aparece enmascarado, coherente con la respuesta real de la API.'),
  h3('Reflexión de seguridad'),
  p('La prueba más importante de esta práctica es la 403: confirma que la autorización se valida en el backend y no solo ocultando botones en el frontend. Si un usuario CONSULTA intentara llamar directamente a la API con herramientas como curl o Postman, sin pasar por la interfaz, seguiría recibiendo 403 — que es justo el riesgo que la Práctica 2 identificó como crítico (RBAC solo en frontend).'),
);

// ---------------- PRACTICA 4 ----------------
sections.push(
  h2('5. Práctica 4 — Controles preventivos, detectivos y correctivos en la API'),
  h3('Objetivo práctico'),
  p('Transformar la API en una solución más robusta, segura, trazable y auditable mediante validación estricta de datos con Zod (preventivo), limitación de tasa con express-rate-limit (preventivo), trazabilidad con Morgan (detectivo) y manejo centralizado de errores (correctivo).'),
  h3('Archivos intervenidos'),
  bullet('backend/src/validators/incident.schema.js — esquema Zod para la creación de incidentes.'),
  bullet('backend/src/validators/user.schema.js — esquema Zod para el login.'),
  bullet('backend/src/routes/auth.routes.js — rate limiter (5 solicitudes/minuto) aplicado a /auth/login.'),
  bullet('backend/src/middlewares/errorHandler.js — notFoundHandler (404) y centralizedErrorHandler (incluye errores de Zod como 400).'),
  bullet('backend/src/app.js — morgan("combined") registrando cada petición, y express.json({ limit: "1mb" }) contra payloads gigantes.'),
  h3('Pruebas ejecutadas'),
  pb('Validación con Zod — datos inválidos: ', 'título muy corto, descripción muy corta, severidad fuera del enum y correo mal formado.'),
  codeBlock(p4_zod, 15),
  figureCaption('Resultado: 400 Bad Request con el detalle exacto de cada campo inválido, generado por el manejador centralizado de errores al capturar la excepción de Zod.'),
  pb('Ruta inexistente: ', 'petición a una URL que no existe en la API.'),
  codeBlock(p4_404),
  figureCaption('Resultado: 404 con mensaje JSON consistente (no la página de error por defecto de Express), gracias al notFoundHandler centralizado.'),
  pb('Rate limiting en /auth/login: ', 'seis peticiones seguidas contra el login.'),
  codeBlock(p4_rate, 25),
  figureCaption('A partir del cuarto intento dentro de la misma ventana de 60 segundos, el servidor responde 429 "Demasiados intentos de login". El contador es acumulativo por IP sobre la ruta /auth/login (incluye también los logins válidos hechos antes en las pruebas de RBAC), lo cual confirma que el límite protege el endpoint completo y no solo los intentos fallidos.'),
  pb('Trazabilidad con Morgan: ', 'fragmento real del log del servidor durante las pruebas.'),
  codeBlock(p4_morgan, 20),
  figureCaption('Cada línea registra IP, fecha/hora, método, ruta, código de estado y tamaño de respuesta — evidencia suficiente para reconstruir qué pasó ante un incidente.'),
  h3('Reflexión de seguridad'),
  p('Estos cuatro controles se complementan: Zod evita que datos corruptos lleguen a la base de datos, el rate limiting evita que alguien agote el login por fuerza bruta, Morgan deja rastro de todo lo anterior, y el manejador centralizado de errores evita que el servidor filtre trazas internas (stack traces) en las respuestas de error, devolviendo siempre mensajes controlados.'),
);

// ---------------- PRACTICA 5 ----------------
sections.push(
  h2('6. Práctica 5 — Módulo de incidentes protegido'),
  h3('Objetivo práctico'),
  p('Proteger el módulo de incidentes end-to-end: variables de entorno por ambiente, sanitización de entradas, validación con Zod, modelo Incident en Prisma, rutas protegidas por rol, y enmascaramiento del correo del reportero para roles distintos de ADMIN.'),
  h3('Archivos intervenidos'),
  bullet('backend/prisma/schema.prisma — modelo Incident (title, description, severity, status, reporterEmail, reportedById, createdAt) y su relación con User.'),
  bullet('backend/src/lib/sanitize.js — sanitizeObject()/sanitizeString(), limpia etiquetas HTML y caracteres de plantilla antes de validar.'),
  bullet('backend/src/routes/incidents.routes.js — POST/GET /incidents con RBAC, sanitización, validación Zod y enmascaramiento condicional del correo.'),
  bullet('backend/.env.example — DATABASE_URL, JWT_SECRET y NODE_ENV como variables separadas por ambiente.'),
  h3('Modelo de datos protegido (Prisma)'),
  codeBlock(schemaPrisma, 40),
  h3('Pruebas ejecutadas'),
  pb('Creación de un incidente válido (rol ADMIN): ', ''),
  codeBlock(p5_create),
  figureCaption('201 Created: el incidente se guarda con los datos ya sanitizados y validados.'),
  pb('Listado como CONSULTA — correo enmascarado: ', ''),
  codeBlock(p5_mask_consulta),
  figureCaption('El campo reporterEmail se devuelve como "ma*************@securedesk.local" en lugar del correo completo.'),
  pb('Listado como ADMIN — correo completo: ', ''),
  codeBlock(p5_mask_admin),
  figureCaption('El mismo incidente, para el rol ADMIN, muestra el correo completo del reportero. La diferencia depende exclusivamente del rol dentro del token JWT, no de un parámetro que el cliente pueda manipular.'),
  h3('Reflexión de seguridad'),
  p('Enmascarar el correo del reportero según el rol aplica el principio de mínimo privilegio a nivel de datos, no solo de rutas: un ANALISTA o CONSULTA puede necesitar ver que existe un incidente sin necesitar el dato personal de quien lo reportó. Sanitizar antes de validar con Zod, y no al revés, evita que una entrada maliciosa pase la validación de formato y luego se almacene con contenido peligroso.'),
);

// ---------------- PRACTICA 6 ----------------
sections.push(
  h2('7. Práctica 6 — Usuarios, backups y continuidad'),
  h3('Objetivo práctico'),
  p('Gestionar el ciclo de vida de los usuarios (activar/desactivar) con verificación por JWT y rol ADMIN, y ejecutar un ciclo completo y real de backup y restauración de PostgreSQL: generar el respaldo con pg_dump, simular una pérdida de datos, restaurar con psql y verificar que la información vuelve a estar disponible.'),
  h3('Archivos intervenidos'),
  bullet('backend/src/routes/users.routes.js — GET /users, PATCH /users/:id/activate, PATCH /users/:id/deactivate (solo ADMIN).'),
  bullet('backend/src/routes/auth.routes.js — el login verifica user.isActive y responde 403 si la cuenta está desactivada.'),
  bullet('backend/scripts/backup.sh — genera el backup con pg_dump contra el contenedor Docker securedesk_db.'),
  bullet('backend/scripts/restore.sh — recrea la base de datos y restaura un archivo .sql con psql.'),
  h3('Gestión de usuarios — pruebas con JWT y rol ADMIN'),
  pb('Listado de usuarios (ADMIN): ', ''),
  codeBlock(p6_users),
  pb('Desactivación del usuario CONSULTA: ', ''),
  codeBlock(p6_deactivate),
  pb('El usuario desactivado intenta iniciar sesión: ', ''),
  codeBlock(p6_login_desactivado),
  figureCaption('403 Forbidden — "Usuario desactivado, contacte al administrador". Desactivar una cuenta bloquea el acceso de inmediato, incluso si la persona conoce su contraseña.'),
  pb('Reactivación del usuario: ', ''),
  codeBlock(p6_activate),
  h3('Backup real de PostgreSQL'),
  codeBlock(p6_backup),
  figureCaption('Ejecución real de scripts/backup.sh: pg_dump genera un archivo .sql de 7.0 KB contra el contenedor Docker "securedesk_db".'),
  codeBlock(p6_backup_contenido, 18),
  figureCaption('Verificación del contenido real del backup: incluye las filas de la tabla Incident y User (contraseñas ya cifradas con bcrypt, nunca en texto plano).'),
  h3('Restauración real — simulación de pérdida de datos'),
  pb('Estado antes del incidente simulado (3 incidentes): ', ''),
  codeBlock(p6_antes, 8),
  pb('Incidente simulado — se borra la tabla Incident por error: ', ''),
  codeBlock(p6_dano, 8),
  pb('Restauración desde el backup con scripts/restore.sh: ', ''),
  codeBlock(p6_restore, 25),
  pb('Verificación posterior — los datos vuelven a estar disponibles: ', ''),
  codeBlock(p6_despues, 8),
  imageFromFile('cap_p6_prisma_studio_incidents.jpg', 480),
  figureCaption('Prisma Studio, tras la restauración: los 3 incidentes originales (ids 1, 2 y 3) están de nuevo en la base de datos, confirmando que la restauración devolvió el sistema al estado previo al incidente simulado.'),
  h3('Reflexión de seguridad'),
  p('Ejecutar el ciclo completo — no solo generar el backup, sino además borrar datos a propósito y restaurarlos — es lo único que demuestra que un plan de respaldo funciona de verdad. Un archivo .sql que nunca se ha usado para restaurar es una promesa, no una garantía; aquí se comprobó que el archivo generado por pg_dump sí permite recuperar exactamente los mismos tres incidentes después de una pérdida simulada.'),
);

// ---------------- TABLA RESUMEN ----------------
const resumenHeaders = ['Práctica', 'Control implementado', 'Evidencia presentada', 'Resultado obtenido', 'Riesgo mitigado'];
const resumenRows = [
  ['1', 'Separación frontend/backend, .env por ambiente, endpoint de salud', 'curl a /health, estructura de archivos, .env.example', '200 OK en /health; secretos fuera del código', 'Exposición de credenciales y falta de visibilidad del servicio'],
  ['2', 'Matriz de riesgos de implantación', 'Tabla activo/amenaza/vulnerabilidad/impacto/probabilidad/control', 'Riesgos priorizados antes de programar', 'Controles implementados sin orden ni justificación'],
  ['3', 'RBAC con JWT + authorizeRoles()', 'Pruebas 401/403/200 y capturas de frontend por rol', 'Acceso administrativo bloqueado para roles no autorizados', 'Escalamiento de privilegios / RBAC solo en frontend'],
  ['4', 'Zod, express-rate-limit, Morgan, manejo centralizado de errores', 'Pruebas de 400, 404, 429 y log de Morgan', 'Entradas inválidas y fuerza bruta bloqueadas; todo queda registrado', 'Datos malformados, fuerza bruta al login, fuga de stack traces'],
  ['5', 'Modelo Incident protegido con enmascaramiento por rol', 'Creación de incidente, listado enmascarado (CONSULTA) vs completo (ADMIN)', 'reporterEmail visible solo para ADMIN', 'Exposición innecesaria de datos personales'],
  ['6', 'Gestión de usuarios (activar/desactivar) + backup y restauración real', 'Login bloqueado tras desactivar, pg_dump, borrado simulado, psql restore, Prisma Studio', 'Cuenta desactivada no puede iniciar sesión; datos recuperados tras pérdida simulada', 'Acceso indebido de cuentas inactivas y pérdida irreversible de datos'],
];
sections.push(
  h2('8. Tabla resumen de las seis prácticas'),
  simpleTable(resumenHeaders, resumenRows, [700, 2000, 2350, 2150, 2150]),
  new Paragraph({ text: '', spacing: { after: 300 } }),
);

// ---------------- CONCLUSION ----------------
sections.push(
  h2('9. Conclusión general'),
  p('Construir SecureDesk ADSO práctica por práctica deja claro que la seguridad de una API no depende de un solo control grande, sino de varios controles pequeños que se apoyan entre sí: la autenticación no sirve de nada sin autorización por rol, la autorización no sirve de nada si los datos que llegan al backend no se validan, la validación no sirve de nada si no queda registrada, y ningún control anterior importa si un error humano borra la base de datos y no hay con qué restaurarla. Cada práctica resolvió una pieza distinta de ese mismo problema: quién entra, qué puede hacer, qué datos puede ver, qué le pasa a lo que envía, quién queda responsable de cada acción, y cómo se recupera el sistema si algo falla.'),
  p('De las seis, la práctica que considero más importante para evitar incidentes en producción es la Práctica 6 (gestión de usuarios, backup y restauración), y específicamente el hecho de haber probado la restauración de verdad, no solo de haberla documentado. Los controles preventivos (RBAC, Zod, rate limiting) reducen la probabilidad de que algo salga mal, pero ninguno de ellos garantiza que, si de todas formas algo falla —un error humano, una migración mal aplicada, una restauración nunca antes intentada—, el sistema pueda volver a funcionar. Antes de este ejercicio, un backup era, en la práctica, solo un archivo que nadie había necesitado abrir; después de simular la pérdida de datos y recuperarlos con éxito, ese mismo backup se convirtió en una garantía verificada. Esa diferencia, entre tener una copia y saber que esa copia funciona, es exactamente lo que separa a un equipo que puede recuperarse de un incidente real de uno que solo cree que puede.', {}),
);

// ---------------- DOC ----------------
const doc = new Document({
  sections: [
    {
      properties: {},
      children: sections,
    },
  ],
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22 } },
    },
  },
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath = path.join(ROOT, 'Dossier_Evidencias_Practicas_Seguridad_Informatica_Clases_1_a_6.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('Documento generado en:', outPath);
});
