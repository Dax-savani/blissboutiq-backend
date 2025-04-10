const router = require('express').Router();
const {
    handleGetWishlist,
    handleAddWishlist,
    handleRemoveWishlist
} = require('../controllers/wishlist')

router.get('/', handleGetWishlist);
router.post('/', handleAddWishlist);
router.delete('/:productId', handleRemoveWishlist);


module.exports = router;