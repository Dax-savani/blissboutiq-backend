const router = require('express').Router();
const {handleAddCart,handleEditCart,handleGetCart,handleGetSingleCart , handleDeleteCart} = require('../controllers/cart')

router.get('/',handleGetCart);

router.get('/:cartId',handleGetSingleCart);

router.post('/',handleAddCart);

router.put('/:cartId',handleEditCart);

router.delete('/:cartId',handleDeleteCart);


module.exports = router;