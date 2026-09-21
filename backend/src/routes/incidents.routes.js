const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateJWT } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/authorizeRoles');
const { createIncidentSchema } = require('../validators/incident.schema');
const { sanitizeObject } = require('../lib/sanitize');

const router = express.Router();

function maskEmail(email) {
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  const visible = user.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(user.length - 2, 1))}@${domain}`;
}

function serializeIncident(incident, role) {
  return {
    id: incident.id,
    title: incident.title,
    description: incident.description,
    severity: incident.severity,
    status: incident.status,
    reporterEmail: role === 'ADMIN' ? incident.reporterEmail : maskEmail(incident.reporterEmail),
    createdAt: incident.createdAt,
  };
}

// ADMIN y ANALISTA pueden crear incidentes; CONSULTA solo lee (RBAC)
router.post(
  '/incidents',
  authenticateJWT,
  authorizeRoles('ADMIN', 'ANALISTA'),
  async (req, res, next) => {
    try {
      const clean = sanitizeObject(req.body);
      const data = createIncidentSchema.parse(clean);

      const incident = await prisma.incident.create({
        data: { ...data, reportedById: req.user.sub },
      });

      res.status(201).json(serializeIncident(incident, req.user.role));
    } catch (err) {
      next(err);
    }
  }
);

// Los tres roles pueden listar, pero el correo del reportero se enmascara salvo para ADMIN
router.get(
  '/incidents',
  authenticateJWT,
  authorizeRoles('ADMIN', 'ANALISTA', 'CONSULTA'),
  async (req, res, next) => {
    try {
      const incidents = await prisma.incident.findMany({ orderBy: { createdAt: 'desc' } });
      res.status(200).json(incidents.map((i) => serializeIncident(i, req.user.role)));
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
