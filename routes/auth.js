const express = require('express');
const { handleCreateUser ,handleLoginCtrl} = require('../controllers/user');
const router = express.Router();

router.post('/register',handleCreateUser);

router.post('/login',handleLoginCtrl);

module.exports = router;
