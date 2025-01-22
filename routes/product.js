const router = require('express').Router();
const {handleCreateProduct , handleGetProduct , handleDeleteProduct , handleGetSingleProduct , handleEditProduct} = require('../controllers/product');
const {auth} = require("../middlewares/auth");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/', auth,upload.any(), handleCreateProduct);
router.put('/:productId',auth, upload.array("product_images",20), handleEditProduct);
router.delete('/:productId', auth,handleDeleteProduct);
router.get('/', handleGetProduct);
router.get('/:productId', handleGetSingleProduct);


module.exports = router;


