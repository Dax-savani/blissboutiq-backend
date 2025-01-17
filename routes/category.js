const router = require('express').Router();
const { handleGetCategories,
    handleGetSingleCategory,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory} = require('../controllers/category');
const {
    handleGetSubcategories,
    handleAddSubcategory,
    handleEditSubcategory,
    handleGetSingleSubcategory,
    handleDeleteSubcategory
} = require('../controllers/subcategory');
const multer = require('multer');
const {auth} = require("../middlewares/auth");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.get('/', handleGetCategories);
router.get('/:categoryId', handleGetSingleCategory);
router.post('/',auth, upload.single("image"), handleCreateCategory);
router.put('/:categoryId',auth, upload.single("image"), handleEditCategory);
router.delete('/:categoryId',auth, handleDeleteCategory);


router.get('/:categoryId/subcategory', handleGetSubcategories);
router.get('/subcategory/:subcategoryId', handleGetSingleSubcategory);
router.post('/:categoryId/subcategory',auth, handleAddSubcategory);
router.put('/:categoryId/subcategory/:subcategoryId',auth, handleEditSubcategory);
router.delete('/:categoryId/subcategory/:subcategoryId',auth, handleDeleteSubcategory);

module.exports = router;


