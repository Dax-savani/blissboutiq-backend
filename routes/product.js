const router = require('express').Router();
const {handleCreateProduct , handleGetProduct , handleDeleteProduct , handleGetSingleProduct , handleEditProduct} = require('../controllers/product');
const multer = require('multer');
const {auth} = require("../middlewares/auth");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/', auth,upload.array("product_images",10), handleCreateProduct);
router.put('/:productId',auth, upload.array("product_images",10), handleEditProduct);
router.delete('/:productId', auth,handleDeleteProduct);
router.get('/product', handleGetProduct);
router.get('/product/:productId', handleGetSingleProduct);


module.exports = router;


