require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Sena2026!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@securedesk.local' },
    update: {},
    create: { email: 'admin@securedesk.local', password: passwordHash, role: 'ADMIN' },
  });

  const analista = await prisma.user.upsert({
    where: { email: 'analista@securedesk.local' },
    update: {},
    create: { email: 'analista@securedesk.local', password: passwordHash, role: 'ANALISTA' },
  });

  await prisma.user.upsert({
    where: { email: 'consulta@securedesk.local' },
    update: {},
    create: { email: 'consulta@securedesk.local', password: passwordHash, role: 'CONSULTA' },
  });

  await prisma.incident.createMany({
    data: [
      {
        title: 'Intentos repetidos de login fallido',
        description: 'Se detectaron 12 intentos fallidos de inicio de sesion contra la cuenta admin en 2 minutos.',
        severity: 'ALTA',
        reporterEmail: 'seguridad.monitoreo@securedesk.local',
        reportedById: analista.id,
      },
      {
        title: 'Variable de entorno expuesta en log',
        description: 'Un log de desarrollo imprimio por error el valor de JWT_SECRET durante una prueba local.',
        severity: 'CRITICA',
        reporterEmail: 'devops@securedesk.local',
        reportedById: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completado: usuarios y incidentes de ejemplo creados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
