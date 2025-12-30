const express = require('express');
const router = express.Router();
const { createNewUser, showAllUsers } = require('../controller/user.controller');

router.post('/createUser', createNewUser);
router.get('/getAllUsers', showAllUsers);

module.exports = router;