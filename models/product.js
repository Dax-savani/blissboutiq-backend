const mongoose = require("mongoose");
const {Schema} = mongoose;


const colorSchema = new Schema({
        color: {
            type: String,
            required: true,
        },
        hex: {
            type: String,
            required: true
        }
    }, {
        _id: false
    }
)

const sizeSchema = new Schema({
    size: {
        type: String,
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    _id: false
})

const productPriceSchema = new Schema({
    orignal_price: {
        type: String,
        required: true,
    },
    discounted_price: {
        type: String,
        required: true,
    },
}, {
    _id: false
});
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    color_options: {
        type: [colorSchema],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "At least one Color option is required."
        }
    },
    price: {
        type: productPriceSchema,
        required: true
    },
    size_options: {
        type: [sizeSchema],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: 'At least one size option is required.'
        }
    },
    instruction: {
        type: [String],
        required: false
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    other_info: {
        type: Object,
        required: false
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unisex']
    },
    product_images: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "At least one product image is required."
        }
    }
}, {timestamps: true});


module.exports = mongoose.model("Product", productSchema);