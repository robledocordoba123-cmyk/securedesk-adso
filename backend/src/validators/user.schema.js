const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Correo invalido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
});

module.exports = { loginSchema };
