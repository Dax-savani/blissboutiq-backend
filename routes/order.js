const router = require('express').Router();
const {handleCreateRazorpayOrder,handleUpdateOrderStatus,handleGetSingleOrder,handleValidateAndPlaceOrder,handleGetOrder} = require('../controllers/order')

router.get('/',handleGetOrder);

router.get('/:orderId',handleGetSingleOrder);

router.put('/:orderId', handleUpdateOrderStatus);

router.post('/razorpay-order', handleCreateRazorpayOrder);

router.post('/razorpay-validate', handleValidateAndPlaceOrder);



module.exports = router;