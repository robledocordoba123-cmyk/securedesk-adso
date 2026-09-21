const express = require('express');
const { authenticateJWT } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/authorizeRoles');

const router = express.Router();

// Ruta administrativa protegida: solo ADMIN puede entrar (usada para probar 401/403/200)
router.get('/admin/ping', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
  res.status(200).json({
    mensaje: 'Acceso administrativo concedido',
    usuario: req.user.email,
    rol: req.user.role,
  });
});

module.exports = router;
