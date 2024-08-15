const router = require('express').Router();
const {handleGetProduct , handleGetSingleProduct } = require('../controllers/product');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/product', handleGetProduct);
router.get('/product/:productId', handleGetSingleProduct);

module.exports = router;