const express = require('express');
const router = express.Router();
const { createNewSession, endSession } = require('../controller/session.controller');
const  requireAuth = require('../middleware/requireAuth');

router.post('/create', requireAuth, createNewSession);
router.patch('/:sessionId/end', requireAuth, endSession);

module.exports = router;