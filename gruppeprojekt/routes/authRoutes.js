const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Login (IKKE beskyttet - man skal kunne logge ind)
router.post('/login', authController.login);

// POST /api/auth/logout - Log udd af bruger og slet JWT cookie (IKKE beskyttet - man skal kunne logge ud)
router.post('/logout', authController.logout);

// GET /api/auth/me - Hent info om logget ind bruger tjekker om bruger er logget ind verificere JWT
router.get('/me', authController.checkAuth, (req, res) => {
   // checkAuth middleware verificerer JWT token
  // Hvis OK, returnerer bruger info så vi kan bruge det i vores frontend
  res.json({
    success: true,
    host: {
      navn: req.user.navn,
      email: req.user.email
    }
  });
});

module.exports = router;

