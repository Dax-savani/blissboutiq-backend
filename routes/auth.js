const express = require('express');
const { handleCreateUser ,handleGetAllUsers,handleEditAddress,handleLoginCtrl,handleGetMe} = require('../controllers/user');
const {auth} = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const router = express.Router();

router.get('/',auth, isAdmin ,handleGetAllUsers);

router.post('/register',handleCreateUser);

router.post('/login',handleLoginCtrl);

router.put('/:id',auth,handleEditAddress);

router.get('/me',auth, handleGetMe);


module.exports = router;
