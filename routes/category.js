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
    handleDeleteSubcategory
} = require('../controllers/subcategory');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.get('/', handleGetCategories);
router.get('/:categoryId', handleGetSingleCategory);
router.post('/', upload.single("image"), handleCreateCategory);
router.put('/:categoryId', upload.single("image"), handleEditCategory);
router.delete('/:categoryId', handleDeleteCategory);


router.get('/:categoryId/subcategory', handleGetSubcategories);
router.post('/:categoryId/subcategory', handleAddSubcategory);
router.put('/:categoryId/subcategory/:subcategoryId', handleEditSubcategory);
router.delete('/:categoryId/subcategory/:subcategoryId', handleDeleteSubcategory);

module.exports = router;


