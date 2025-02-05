const router = require('express').Router();
const {handleCreateRazorpayOrder,handleGetSingleOrder,handleValidateAndPlaceOrder,handleGetOrder} = require('../controllers/order')

router.get('/',handleGetOrder);

router.get('/:orderId',handleGetSingleOrder);

// router.post('/',handleAddOrder);

router.post('/razorpay-order', handleCreateRazorpayOrder);

router.post('/razorpay-validate', handleValidateAndPlaceOrder);



module.exports = router;