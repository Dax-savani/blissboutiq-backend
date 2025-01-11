const router = require('express').Router();
const { handleGetCategories,
    handleGetSingleCategory,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory} = require('../controllers/category');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/', upload.single("image"), handleCreateCategory);
router.put('/:categoryId', upload.single("image"), handleEditCategory);
router.delete('/:categoryId', handleDeleteCategory);
router.delete('/:categoryId', handleGetSingleCategory);
router.delete('/', handleGetCategories);

module.exports = router;


