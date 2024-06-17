const express = require('express');
const { handleCreateUser } = require('../controllers/userCtrl');
const router = express.Router();

router.post('/register',handleCreateUser);


module.exports = router;
