const express = require('express');
const prisma = require('../lib/prisma');
const { authenticateJWT } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/authorizeRoles');

const router = express.Router();

// Gestion de usuarios: solo ADMIN
router.get('/users', authenticateJWT, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { id: 'asc' },
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/users/:id/activate',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  async (req, res, next) => {
    try {
      const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: { isActive: true },
      });
      res.status(200).json({ id: user.id, email: user.email, isActive: user.isActive });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/users/:id/deactivate',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  async (req, res, next) => {
    try {
      const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: { isActive: false },
      });
      res.status(200).json({ id: user.id, email: user.email, isActive: user.isActive });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
