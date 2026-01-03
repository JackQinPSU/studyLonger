const express = require('express');
const router = express.Router();
const { loginUser } = require('../controller/auth.controller');
const  requireAuth = require('../middleware/requireAuth');
router.post('/login', loginUser);
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;