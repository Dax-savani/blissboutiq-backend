const router = require('express').Router();
const { handleGetCategories,
    handleGetSingleCategory,
    handleCreateCategory,
    handleGetCategoriesByGender,
    handleEditCategory,
    handleDeleteCategory} = require('../controllers/category');
const {
    handleGetSubcategories,
    handleAddSubcategory,
    handleEditSubcategory,
    handleGetSingleSubcategory,
    handleGetSubcategoriesGroupedByCategory,
    handleDeleteSubcategory
} = require('../controllers/subcategory');
const multer = require('multer');
const {auth} = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.get('/gender-wise', handleGetCategoriesByGender);
router.get('/', handleGetCategories);
router.get('/:categoryId', handleGetSingleCategory);
router.post('/',auth,isAdmin, upload.single("image"), handleCreateCategory);
router.put('/:categoryId',auth,isAdmin, upload.single("image"), handleEditCategory);
router.delete('/:categoryId',auth,isAdmin, handleDeleteCategory);


router.get('/subcategory/list', handleGetSubcategoriesGroupedByCategory);
router.get('/:categoryId/subcategory', handleGetSubcategories);
router.get('/subcategory/:subcategoryId', handleGetSingleSubcategory);
router.post('/:categoryId/subcategory',auth,isAdmin, upload.single("image"), handleAddSubcategory);
router.put('/:categoryId/subcategory/:subcategoryId',auth,isAdmin ,upload.single("image"), handleEditSubcategory);
router.delete('/:categoryId/subcategory/:subcategoryId',auth,isAdmin, handleDeleteSubcategory);

module.exports = router;


