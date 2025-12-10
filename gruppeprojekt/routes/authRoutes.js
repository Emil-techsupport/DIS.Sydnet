const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Login
router.post('/login', authController.login);
//    Route til login IKKE middleware
//    Alle kan kalde denne (ingen checkAuth)


// POST /api/auth/logout - Log udd af bruger og slet JWT cookie
router.post('/logout', authController.logout);
//    Route til logout IKKE middleware
//    Alle kan kalde denne (ingen checkAuth)

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

