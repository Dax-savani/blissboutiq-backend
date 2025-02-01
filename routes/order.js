const router = require('express').Router();
const {handleAddOrder,handleGetOrder,handleGetSingleOrder} = require('../controllers/order')

router.get('/',handleGetOrder);

router.get('/:orderId',handleGetSingleOrder);

router.post('/',handleAddOrder);


module.exports = router;