const express = require('express');
const { handleCreateUser ,handleEditAddress,handleLoginCtrl,handleGetMe} = require('../controllers/user');
const {auth} = require("../middlewares/auth");
const router = express.Router();

router.post('/register',handleCreateUser);

router.post('/login',handleLoginCtrl);

router.put('/:id',auth,handleEditAddress);

router.get('/me',auth, handleGetMe);

module.exports = router;
