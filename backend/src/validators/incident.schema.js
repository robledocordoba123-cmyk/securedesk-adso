const { z } = require('zod');

const createIncidentSchema = z.object({
  title: z.string().min(5, 'El titulo debe tener al menos 5 caracteres').max(120),
  description: z.string().min(10, 'La descripcion debe tener al menos 10 caracteres').max(2000),
  severity: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']),
  reporterEmail: z.string().email('Correo del reportero invalido'),
});

module.exports = { createIncidentSchema };
