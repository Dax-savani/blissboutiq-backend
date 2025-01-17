const mongoose = require('mongoose');
const {Schema} = mongoose;

const wishlistSchema = new Schema({
    user_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    product_id: {
        ref: "Product",
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("Wishlist", wishlistSchema);