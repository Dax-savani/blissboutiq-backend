const Product = require('../models/product');
const Cart = require('../models/cart');
const asyncHandler = require("express-async-handler");
const {uploadFiles} = require('../helpers/productImage');

const handleGetProduct = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    const cartProducts = await Cart.find({});
    const cartProductsIds = new Set(cartProducts.map((item) => item.product_id.toString()));
    const productsWithCartStatus = products.map((item) => {
        const productObj = item.toObject();
        return {
        ...productObj,
        isCart: cartProductsIds.has(item._id.toString())
    }})
    return res.json(productsWithCartStatus);
});

const handleGetSingleProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (product) {
        return res.json(product)
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
})

const handleCreateProduct = asyncHandler(async (req, res) => {
    console.log(req.body)
    try {
        const {
            title,
            description,
            size_options,
            color_options,
            instruction,
            stock,
            price,
            category,
            sub_category,
            gender,
            other_info,

        } = req.body;

        const files = req.files;

        const fileBuffers = files.map(file => file.buffer);

        const imageUrls = await uploadFiles(fileBuffers);
        const createdProduct = await Product.create({
            title,
            description,
            size_options: JSON.parse(size_options),
            color_options: JSON.parse(color_options),
            instruction: JSON.parse(instruction),
            stock,
            price: JSON.parse(price),
            category,
            sub_category,
            gender,
            other_info,
            product_images: imageUrls,
        });

        return res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error.message);
        return res.status(500).json({status: 500, message: "Internal Server Error"});
    }
});

const handleEditProduct = asyncHandler(async (req, res) => {
    const {productId} = req.params;
    const {
        title,
        description,
        size_options,
        color_options,
        instruction,
        stock,
        category,
        price,
        sub_category,
        gender,
    } = req.body;

    const files = req.files;
    let imageUrls = []

    if (files && files.length > 0) {
        const fileBuffers = files.map(file => file.buffer);
        imageUrls = await uploadFiles(fileBuffers);
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            title,
            description,
            size_options: size_options ? JSON.parse(size_options) : undefined,
            color_options: color_options ? JSON.parse(color_options) : undefined,
            instruction,
            stock,
            category,
            sub_category,
            gender,
            product_images: imageUrls
        }, {runValidators: true, new: true});

        if (updatedProduct) {
            return res.status(200).json({status: 200, message: "Product updated successfully", data: updatedProduct});
        } else {
            res.status(404).json({status: 404, message: "Product not found"});
            throw new Error("Product not found");
        }
    } catch (err) {
        console.error("Error updating Product", err.message);
        return res.status(500).json({message: "Failed to update Product", error: err.message})
    }
})

const handleDeleteProduct = asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
    if (deletedProduct) {
        return res.json({message: "Product removed", deletedProduct})
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
    return res.json(deletedProduct)
})


module.exports = {handleCreateProduct, handleGetProduct, handleDeleteProduct, handleGetSingleProduct, handleEditProduct}
