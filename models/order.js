const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema = new Schema({
    user_id : {
        type: String,
        ref: 'User',
        required: true,
    },
    product_id: {
        type: String,
        ref: 'Product',
        required: true,
    },
    color: {
        type: Object,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        default: 1,
        required: true,
    },
    status: {
        type: String,
        enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'placed',
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    }
},{timestamps: true});

module.exports = mongoose.model("Order", orderSchema);