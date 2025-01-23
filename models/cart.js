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
    color_id: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                const product = await mongoose.model("Product").findById(this.product_id);
                if (!product) return false;
                return product.color_options.some(option => option._id.toString() === value);
            },
            message: "Invalid color ID selected for the product."
        }
    },
    size: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                const product = await mongoose.model("Product").findById(this.product_id);
                if (!product) return false;

                const selectedColor = product.color_options.find(option => option._id.toString() === this.color_id);
                if (!selectedColor) return false;

                return selectedColor.size_options.some(option => option.size === value);
            },
            message: "Invalid size selected for the product."
        }
    },
    qty: {
        type: Number,
        default: 1,
        required: true,
    }
})

module.exports = mongoose.model("Cart", cartSchema);