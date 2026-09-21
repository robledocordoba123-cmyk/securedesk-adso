const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, ImageRun, AlignmentType, BorderStyle, PageBreak,
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

function h2(text) { return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } }); }
function h3(text) { return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } }); }
function p(text) { return new Paragraph({ children: [new TextRun({ text })], spacing: { after: 150 } }); }
function pb(label, text) {
  return new Paragraph({ children: [new TextRun({ text: label, bold: true }), new TextRun({ text })], spacing: { after: 120 } });
}
function figureCaption(text) {
  return new Paragraph({ children: [new TextRun({ text, italics: true, size: 20, color: '475569' })], spacing: { after: 250 } });
}
function imageFromFile(file, widthPx) {
  const buf = fs.readFileSync(path.join(EV, file));
  const h = Math.round((widthPx * 812) / 1510);
  return new Paragraph({ children: [new ImageRun({ data: buf, transformation: { width: widthPx, height: h }, type: 'jpg' })], spacing: { after: 80 } });
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
  return new Table({ width: { size: totalWidth, type: WidthType.DXA }, columnWidths: colWidths, rows: [headerRow, ...bodyRows] });
}

// ---------- Evidence ----------
const p1_health = readEv('p1_health.txt');
const p3_sin_token = readEv('p3_sin_token.txt');
const p3_403 = readEv('p3_403.txt');
const p3_200 = readEv('p3_200.txt');
const p4_404 = readEv('p4_404.txt');
const p4_rate = readEv('p4_rate_limit.txt');
const p4_morgan = readEv('p4_morgan_log.txt');
const p6_backup = readEv('p6_backup.txt');
const p6_backup_contenido = readEv('p6_backup_contenido.txt');
const p6_antes = readEv('p6_antes_restore.txt');
const p6_dano = readEv('p6_dano_simulado.txt');
const p6_restore = readEv('p6_restore.txt');
const p6_despues = readEv('p6_despues_restore.txt');
const p6_login_desactivado = readEv('p6_login_desactivado.txt');
const envExample = fs.readFileSync(path.join(ROOT, 'backend', '.env.example'), 'utf8').trim();

const sections = [];

// ---------------- PORTADA ----------------
sections.push(
  new Paragraph({ text: '', spacing: { before: 1600 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'INFORME DE VERIFICACIÓN PREPRODUCCIÓN', bold: true, size: 38, color: '0F172A' })], spacing: { after: 200 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sistema: SecureDesk ADSO — API de gestión de incidentes de seguridad', bold: true, size: 26, color: '334155' })], spacing: { after: 800 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Seguridad Informática — Clase 7', italics: true, size: 24, color: '0EA5E9' })], spacing: { after: 1200 } }),
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
  h2('1. Introducción y alcance'),
  p('El sistema verificado en este informe es SecureDesk ADSO, la API práctica trabajada en las clases 1 a 6 de Seguridad Informática, sobre la cual ya se implementaron y probaron los controles de seguridad correspondientes. SecureDesk ADSO es un backend en Node.js/Express con base de datos PostgreSQL administrada mediante Prisma ORM, y un frontend separado en HTML/CSS/JavaScript. Sus módulos principales son: autenticación (JWT), control de acceso por rol (ADMIN, ANALISTA, CONSULTA), gestión de incidentes de seguridad (con enmascaramiento de datos sensibles según el rol), gestión de usuarios (activar/desactivar cuentas) y el módulo de respaldo/restauración de la base de datos.'),
  p('El objetivo de esta verificación preproducción es confirmar, con evidencia técnica real y no simulada, que el sistema cumple las condiciones mínimas de seguridad antes de autorizar su paso a un ambiente de producción: pruebas funcionales, de permisos, de configuración, de respaldo, de restauración, de disponibilidad y de trazabilidad (logs). Todas las pruebas de este informe se ejecutaron contra el backend en funcionamiento (http://localhost:4001) y el contenedor PostgreSQL "securedesk_db", no se proyectan sobre un diseño todavía no construido.'),
);

// ---------------- CHECKLIST ----------------
const checklistHeaders = ['Ítem de verificación', '¿Aprobado?', 'Responsable'];
const checklistRows = [
  ['Separación de variables de entorno (.env real vs .env.example) y de puertos por servicio (API 4001, PostgreSQL 5433, frontend 5500)', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['Autenticación con JWT y control de acceso por rol (RBAC) verificados en rutas administrativas', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['Validación y sanitización de datos de entrada (Zod + limpieza de strings) antes de persistir', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['Limitación de tasa (rate limiting) activa en el endpoint de login', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['Manejo centralizado de errores sin exposición de stack traces ni información interna', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['Trazabilidad y logs de acceso activos (Morgan) con formato consistente', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['Backup de base de datos generado correctamente (archivo no vacío, tamaño coherente)', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['Restauración de backup probada en ambiente de prueba, con integridad de datos verificada', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['Gestión de usuarios: cuentas desactivadas pierden acceso de inmediato', 'Aprobado', 'Manuela Córdoba Robledo'],
  ['JWT_SECRET con nivel de robustez apto para producción (secreto largo, aleatorio, gestionado fuera del código)', 'No aprobado', 'Manuela Córdoba Robledo'],
  ['Certificado SSL/TLS (HTTPS) configurado para el tráfico de producción', 'No aprobado', 'Manuela Córdoba Robledo'],
  ['Prueba de disponibilidad bajo carga real (más allá de peticiones individuales)', 'No aprobado', 'Manuela Córdoba Robledo'],
];
sections.push(
  h2('2. Checklist de verificación preproducción'),
  simpleTable(checklistHeaders, checklistRows, [5850, 1700, 1800]),
  new Paragraph({ text: '', spacing: { after: 200 } }),
);

// ---------------- PRUEBAS ----------------
sections.push(h2('3. Pruebas mínimas ejecutadas'));

sections.push(
  h3('Prueba 1 — Funcional (flujo principal: servicio activo y respondiendo)'),
  pb('Prueba ejecutada: ', 'Consultar el endpoint de salud del backend (GET /health) para confirmar que el servicio está activo antes de ejecutar el resto de las pruebas.'),
  codeBlock(p1_health),
  pb('Resultado obtenido: ', '200 OK, respuesta JSON con estado "ok" y timestamp del servidor.'),
  pb('Evidencia: ', 'Salida real de "curl -i http://localhost:4001/health" (arriba).'),
  pb('Responsable: ', 'Manuela Córdoba Robledo.'),
  pb('Decisión: ', 'Aprobado.'),
);

sections.push(
  h3('Prueba 2 — Permisos (control de acceso por rol)'),
  pb('Prueba ejecutada: ', 'Acceder a la ruta administrativa GET /admin/ping en tres condiciones: sin token, con token de un rol no autorizado (CONSULTA) y con token del rol autorizado (ADMIN).'),
  codeBlock(p3_sin_token),
  codeBlock(p3_403),
  codeBlock(p3_200),
  pb('Resultado obtenido: ', '401 sin token, 403 con rol no autorizado, 200 con rol ADMIN. El backend valida el rol de forma independiente a la interfaz.'),
  pb('Evidencia: ', 'Respuestas HTTP reales de las tres peticiones (arriba).'),
  pb('Responsable: ', 'Manuela Córdoba Robledo.'),
  pb('Decisión: ', 'Aprobado.'),
);

sections.push(
  h3('Prueba 3 — Configuración (variables de entorno y superficie expuesta)'),
  pb('Prueba ejecutada: ', 'Revisar la plantilla de variables de entorno (.env.example) publicada en el repositorio, confirmar que el archivo .env real con los valores efectivos no está versionado, y verificar que no hay modo debug ni stack traces expuestos en las respuestas de error.'),
  codeBlock(envExample),
  codeBlock(p4_404),
  pb('Resultado obtenido: ', 'El .env.example no contiene secretos reales (son placeholders); el .env real está excluido del control de versiones; las respuestas de error (incluida una ruta inexistente) devuelven mensajes JSON genéricos sin trazas internas.'),
  pb('Evidencia: ', '.env.example y respuesta 404 controlada (arriba).'),
  pb('Responsable: ', 'Manuela Córdoba Robledo.'),
  pb('Decisión: ', 'Aprobado con observación — el valor real de JWT_SECRET usado en el ambiente de práctica es un secreto de desarrollo, no uno generado para producción (ver Hallazgo 1).'),
);

sections.push(
  h3('Prueba 4 — Respaldo (backup de base de datos)'),
  pb('Prueba ejecutada: ', 'Ejecutar scripts/backup.sh, que corre pg_dump contra el contenedor Docker "securedesk_db", y confirmar que el archivo generado no está vacío, tiene un tamaño coherente y contiene los datos reales de las tablas.'),
  codeBlock(p6_backup),
  codeBlock(p6_backup_contenido, 12),
  pb('Resultado obtenido: ', 'Se generó un archivo .sql de 7.0 KB en la ubicación definida (backend/backups/), con las filas reales de las tablas Incident y User (contraseñas ya cifradas con bcrypt).'),
  pb('Evidencia: ', 'Salida de scripts/backup.sh y verificación de contenido (arriba).'),
  pb('Responsable: ', 'Manuela Córdoba Robledo.'),
  pb('Decisión: ', 'Aprobado.'),
);

sections.push(
  h3('Prueba 5 — Restauración (recuperación de datos)'),
  pb('Prueba ejecutada: ', 'Simular una pérdida de datos borrando toda la tabla Incident, y luego restaurar el backup generado en la Prueba 4 con scripts/restore.sh, midiendo el proceso y validando que los datos vuelven a estar íntegros.'),
  codeBlock(p6_antes, 8),
  codeBlock(p6_dano, 8),
  codeBlock(p6_restore, 20),
  codeBlock(p6_despues, 8),
  imageFromFile('cap_p6_prisma_studio_incidents.jpg', 420),
  figureCaption('Prisma Studio tras la restauración: los 3 incidentes originales están de nuevo en la base de datos.'),
  pb('Resultado obtenido: ', 'La restauración completó sin errores en menos de un minuto y devolvió exactamente los 3 incidentes previos al incidente simulado; se verificó tanto por consola (psql) como visualmente en Prisma Studio.'),
  pb('Evidencia: ', 'Salidas de consola del borrado y la restauración, y captura de Prisma Studio (arriba).'),
  pb('Responsable: ', 'Manuela Córdoba Robledo.'),
  pb('Decisión: ', 'Aprobado.'),
);

sections.push(
  h3('Prueba 6 — Disponibilidad (manejo de errores y límite de tasa)'),
  pb('Prueba ejecutada: ', 'Enviar seis peticiones seguidas al login para verificar el comportamiento del sistema ante un volumen alto de solicitudes, y confirmar que una ruta inexistente responde de forma controlada.'),
  codeBlock(p4_rate, 15),
  pb('Resultado obtenido: ', 'A partir del cuarto intento en la misma ventana de 60 segundos, el servidor responde 429 en vez de intentar procesar la petición contra la base de datos, protegiendo el servicio de una sobrecarga por fuerza bruta. No se ejecutó una prueba de carga con herramientas especializadas (ver Hallazgo 3).'),
  pb('Evidencia: ', 'Seis peticiones consecutivas a /auth/login (arriba).'),
  pb('Responsable: ', 'Manuela Córdoba Robledo.'),
  pb('Decisión: ', 'Aprobado con observación — falta una prueba de carga real antes de producción.'),
);

sections.push(
  h3('Prueba 7 — Revisión de logs y auditoría'),
  pb('Prueba ejecutada: ', 'Revisar el log generado por Morgan durante las pruebas anteriores, y confirmar que un intento de acceso de una cuenta desactivada también queda registrado.'),
  codeBlock(p4_morgan, 16),
  codeBlock(p6_login_desactivado, 10),
  pb('Resultado obtenido: ', 'Cada peticion queda registrada con IP, fecha/hora, método, ruta, código de estado y tamaño de respuesta, incluyendo los intentos rechazados (401, 403, 429) y el bloqueo de una cuenta desactivada (403).'),
  pb('Evidencia: ', 'Fragmento del log del servidor y respuesta del login bloqueado (arriba).'),
  pb('Responsable: ', 'Manuela Córdoba Robledo.'),
  pb('Decisión: ', 'Aprobado.'),
);

// ---------------- HALLAZGOS ----------------
const hallazgosHeaders = ['Hallazgo', 'Evidencia', 'Impacto', 'Acción correctiva', 'Responsable', 'Fecha límite'];
const hallazgosRows = [
  [
    'JWT_SECRET usado en el ambiente de práctica es un valor de desarrollo, no un secreto generado para producción',
    'backend/.env (valor efectivo del ambiente de práctica)',
    'Alto — si el secreto es predecible, se podrían falsificar tokens de cualquier rol',
    'Generar un secreto aleatorio de al menos 32 bytes con un generador criptográfico y cargarlo como variable de entorno del proveedor de despliegue, nunca en el repositorio',
    'Manuela Córdoba Robledo',
    'Antes del primer despliegue a producción',
  ],
  [
    'No hay certificado TLS/HTTPS configurado; todo el tráfico de prueba corre sobre HTTP en localhost',
    'URLs de prueba http://localhost:4001 y http://127.0.0.1:5500',
    'Alto — en producción, tokens JWT y credenciales viajarían en texto plano',
    'Configurar HTTPS mediante el certificado gestionado del proveedor de despliegue (o un proxy inverso con TLS) antes de exponer el servicio públicamente',
    'Manuela Córdoba Robledo',
    'Antes del primer despliegue a producción',
  ],
  [
    'No se ejecutó una prueba de carga real (solo peticiones individuales y ráfagas cortas)',
    'Prueba 6 — seis peticiones consecutivas a /auth/login',
    'Medio — no se conoce el comportamiento del sistema ante concurrencia alta',
    'Ejecutar una prueba de carga con una herramienta como k6 o autocannon simulando usuarios concurrentes antes del despliegue definitivo',
    'Manuela Córdoba Robledo',
    'Antes del despliegue a producción con usuarios reales',
  ],
];
sections.push(
  h2('4. Hallazgos y no conformidades'),
  simpleTable(hallazgosHeaders, hallazgosRows, [1900, 1500, 1600, 2350, 1000, 1000]),
  new Paragraph({ text: '', spacing: { after: 200 } }),
);

// ---------------- CONCLUSION ----------------
sections.push(
  h2('5. Conclusión argumentada'),
  p('Con base en las siete pruebas ejecutadas, SecureDesk ADSO cumple de forma sólida los controles de seguridad aplicativa que dependen del código: el control de acceso por rol se valida en el backend y no solo en la interfaz (Prueba 2), las entradas se validan y sanitizan antes de persistir, el sistema responde de forma controlada ante fuerza bruta y rutas inexistentes (Prueba 6), y el ciclo de respaldo y restauración de la base de datos se probó de extremo a extremo con datos reales, no solo documentado en teoría (Pruebas 4 y 5). Los logs de Morgan permiten reconstruir qué pasó ante cualquier intento sospechoso (Prueba 7), lo cual es una condición mínima para poder auditar un incidente después de que ocurra.'),
  p('Sin embargo, el sistema no está listo para pasar a un ambiente de producción real todavía, porque dos de los tres hallazgos registrados son de impacto alto y afectan directamente la confidencialidad del sistema en producción: el JWT_SECRET actual es un valor de desarrollo, no un secreto apto para producción, y no existe todavía cifrado en tránsito (HTTPS) para el tráfico entre el frontend y la API. Desplegar así, tal como está, dejaría los tokens de sesión y las credenciales expuestos a cualquiera que intercepte el tráfico de red, sin importar qué tan bien funcionen el resto de los controles.'),
  p('Mi decisión es postergar el paso a producción hasta resolver esos dos hallazgos de impacto alto, que son correcciones concretas y de corto plazo (rotar el secreto y activar TLS), no rediseños del sistema. La prueba de carga (Hallazgo 3) es de impacto medio y puede resolverse en paralelo al primer despliegue en un ambiente de staging, pero los dos hallazgos altos deben quedar cerrados antes de que el sistema reciba tráfico real, porque son exactamente el tipo de omisión que un checklist de aceptación segura está diseñado para detectar antes de que se convierta en un incidente.'),
);

const doc = new Document({
  sections: [{ properties: {}, children: sections }],
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath = path.join(ROOT, '..', 'Informe_Verificacion_Preproduccion_SecureDesk_ADSO.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('Documento generado en:', outPath);
});
