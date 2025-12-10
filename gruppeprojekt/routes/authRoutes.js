const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - bliver kaldt i login.html
// Bliver håndteret af "authController.js"'s login funktion
router.post('/login', authController.login);

// Når denne POST /api/auth/logout bliver kaldt, så kaldes "authController.js" log out funktion
// Logger bruger ud og sletter deres JWT
router.post('/logout', authController.logout);

// GET /api/auth/me bliver kaldt i alle vores html sider, for at verificerer om bruger er logget ind og har godkendt JWT
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

