const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Login
router.post('/login', authController.login);

// POST /api/auth/logout - Logout
router.post('/logout', authController.logout);

// GET /api/auth/me - Hent info om logget ind bruger
router.get('/me', authController.checkAuth, (req, res) => {
  res.json({
    success: true,
    host: {
      navn: req.user.navn,
      email: req.user.email
    }
  });
});

module.exports = router;

