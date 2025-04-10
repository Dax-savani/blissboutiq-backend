const router = require('express').Router();
const {
    handleCreateProduct,
    handleGetProduct,
    handleDeleteProduct,
    handleGetSingleProduct,
    handleEditProduct,
    handleGetProductAttributes
} = require('../controllers/product');
const {auth} = require("../middlewares/auth");
const multer = require('multer');
const {isAdmin} = require("../middlewares/isAdmin");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/', auth, isAdmin, upload.any(), handleCreateProduct);
router.put('/:productId', auth, isAdmin, upload.any(), handleEditProduct);
router.delete('/:productId', auth, isAdmin, handleDeleteProduct);
router.get('/', handleGetProduct);
router.get('/attributes', handleGetProductAttributes);
router.get('/:productId', handleGetSingleProduct);


module.exports = router;


