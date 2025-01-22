const Product = require('../models/product');
const Cart = require('../models/cart');
const Wishlist = require('../models/wishlist');
const mongoose = require('mongoose');
const asyncHandler = require("express-async-handler");
const { uploadFiles } = require('../helpers/productImage');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleGetProduct = asyncHandler(async (req, res) => {
    const { categoryId, gender, subcategoryId } = req.query;
    const filter = {};

    if (categoryId) {
        if (!isValidObjectId(categoryId)) {
            return res.status(400).json({ status: 400, message: "Invalid category ID" });
        }
        filter.category = categoryId;
    }
    if (subcategoryId) {
        if (!isValidObjectId(subcategoryId)) {
            return res.status(400).json({ status: 400, message: "Invalid subcategory ID" });
        }
        filter.subcategory = subcategoryId;
    }
    if (gender) {
        filter.gender = gender;
    }

    try {
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .populate('category', 'name image');

        const cartProducts = await Cart.find({});
        const cartProductIds = new Set(cartProducts.map(item => item.product_id.toString()));

        const productsWithCartStatus = products.map(product => ({
            ...product.toObject(),
            isCart: cartProductIds.has(product._id.toString()),
        }));

        return res.json({ status: 200, message: "Products fetched successfully", data: productsWithCartStatus });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ status: 500, message: "Failed to fetch products" });
    }
});

const handleGetSingleProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
        return res.status(400).json({ status: 400, message: "Invalid product ID" });
    }

    try {
        const product = await Product.findById(productId).populate('category', 'name image');
        if (!product) {
            return res.status(404).json({ status: 404, message: "Product not found" });
        }

        return res.json({ status: 200, message: "Product fetched successfully", data: product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ status: 500, message: "Failed to fetch product" });
    }
});

const handleCreateProduct = asyncHandler(async (req, res) => {
    const { title, description, category, subcategory, gender, color_options, other_info, instruction } = req.body;

    try {
        const parsedColorOptions = typeof color_options === 'string' ? JSON.parse(color_options) : color_options;

        if (!Array.isArray(parsedColorOptions)) {
            return res.status(400).json({ status: 400, message: "Invalid color_options format" });
        }

        const files = req.files;

        const updatedColorOptions = await Promise.all(parsedColorOptions.map(async (colorOption, index) => {
            const productImages = files
                .filter(file => file.fieldname === `product_images[${index}]`)
                .map(file => file.buffer);

            const uploadedImages = await uploadFiles(productImages);  // Assuming uploadFiles returns a promise

            return {
                ...colorOption,
                product_images: uploadedImages,
            };
        }));

        const newProduct = new Product({
            title,
            description,
            color_options: updatedColorOptions,
            instruction: instruction ? JSON.parse(instruction) : undefined,
            category,
            subcategory,
            gender,
            other_info: other_info ? JSON.parse(other_info) : undefined,
        });

        const savedProduct = await newProduct.save();
        return res.status(201).json({ status: 201, message: "Product created successfully", data: savedProduct });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ status: 500, message: "Failed to create product" });
    }
});


const handleEditProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
        return res.status(400).json({ status: 400, message: "Invalid product ID" });
    }

    const { title, description, color_options, instruction, category, subcategory, gender, other_info } = req.body;
    const files = req.files;

    try {
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ status: 404, message: "Product not found" });
        }

        const uploadedImages = files ? await uploadFiles(files.map(file => file.buffer)) : [];
        const updatedImages = [...existingProduct.product_images, ...uploadedImages];

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                title,
                description,
                color_options: color_options ? JSON.parse(color_options) : existingProduct.color_options,
                instruction: instruction ? JSON.parse(instruction) : existingProduct.instruction,
                category,
                subcategory,
                gender,
                other_info: other_info ? JSON.parse(other_info) : existingProduct.other_info,
                product_images: updatedImages,
            },
            { new: true, runValidators: true }
        );

        return res.json({ status: 200, message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ status: 500, message: "Failed to update product" });
    }
});

const handleDeleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
        return res.status(400).json({ status: 400, message: "Invalid product ID" });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ status: 404, message: "Product not found" });
        }

        await Cart.deleteMany({ product_id: productId });
        await Wishlist.deleteMany({ product_id: productId });

        return res.json({ status: 200, message: "Product and related entries deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ status: 500, message: "Failed to delete product" });
    }
});

module.exports = {
    handleGetProduct,
    handleGetSingleProduct,
    handleCreateProduct,
    handleEditProduct,
    handleDeleteProduct,
};
