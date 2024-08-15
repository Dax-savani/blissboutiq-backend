const router = require('express').Router();
const {handleCreateProduct , handleGetProduct , handleDeleteProduct , handleGetSingleProduct , handleEditProduct} = require('../controllers/product');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/', upload.array("product_images",10), handleCreateProduct);
router.put('/:productId', upload.array("product_images",10), handleEditProduct);
router.delete('/:productId', handleDeleteProduct);



module.exports = router;