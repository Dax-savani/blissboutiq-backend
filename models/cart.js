const mongoose = require('mongoose');
const {Schema} = mongoose;

const cartSchema = new Schema({
    user_id : {
        type: String,
        ref: 'User',
        required: true,
    },
    product_id: {
        type: String,
        ref:"Product",
        required: true,
    },
    qty: {
        type: Number,
        default: 1,
        required: true,
    }
})

module.exports = mongoose.model("Cart", cartSchema);