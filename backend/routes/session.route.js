const express = require('express');
const router = express.Router();
const { createNewSession, endSession, listSessions } = require('../controller/session.controller');
const  requireAuth = require('../middleware/requireAuth');

router.post('/create', requireAuth, createNewSession);
router.patch('/:sessionId/end', requireAuth, endSession);
router.get('/', requireAuth, listSessions);
module.exports = router;