const Product = require('../models/product');
const Cart = require('../models/cart');
const Wishlist = require('../models/wishlist');
const Category = require("../models/category");
const mongoose = require('mongoose');
const asyncHandler = require("express-async-handler");
const { uploadFiles } = require('../helpers/productImage');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleGetProduct = asyncHandler(async (req, res) => {
    const { categoryId, gender, subcategoryId, size, color } = req.query;
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
    if (size) {
        filter["color_options.size_options.size"] = size;
    }
    if (color) {
        filter["color_options.color"] = color;
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

            const uploadedImages = await uploadFiles(productImages);

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

        const parsedColorOptions = typeof color_options === 'string' ? JSON.parse(color_options) : color_options;

        if (parsedColorOptions && !Array.isArray(parsedColorOptions)) {
            return res.status(400).json({ status: 400, message: "Invalid color_options format" });
        }

        const updatedColorOptions = parsedColorOptions
            ? await Promise.all(parsedColorOptions.map(async (colorOption, index) => {
                const productImages = files
                    .filter(file => file.fieldname === `product_images[${index}]`)
                    .map(file => file.buffer);

                const uploadedImages = await uploadFiles(productImages);

                return {
                    ...colorOption,
                    product_images: [
                        ...(existingProduct.color_options[index]?.product_images || []),
                        ...uploadedImages,
                    ],
                };
            }))
            : existingProduct.color_options;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                title: title || existingProduct.title,
                description: description || existingProduct.description,
                color_options: updatedColorOptions,
                instruction: instruction ? JSON.parse(instruction) : existingProduct.instruction,
                category: category || existingProduct.category,
                subcategory: subcategory || existingProduct.subcategory,
                gender: gender || existingProduct.gender,
                other_info: other_info ? JSON.parse(other_info) : existingProduct.other_info,
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

const handleGetProductAttributes = asyncHandler(async (req, res) => {
    try {

        const sizes = await Product.aggregate([
            { $unwind: "$color_options" },
            { $unwind: "$color_options.size_options" },
            { $group: { _id: "$color_options.size_options.size" } }
        ]).then(result => result.map(item => item._id));


        const categories = await Product.distinct("category");
        const populatedCategories = await Category.find({ _id: { $in: categories } }).select("name image");


        const colors = await Product.aggregate([
            { $unwind: "$color_options" },
            { $group: { _id: { color: "$color_options.color", hex: "$color_options.hex" } } }
        ]).then(result => result.map(item => item._id));

        return res.json({
            status: 200,
            message: "Product attributes fetched successfully",
            data: {
                sizes: sizes.filter(size => size),
                categories: populatedCategories,
                colors: colors
            }
        });
    } catch (error) {
        console.error("Error fetching product attributes:", error.message);
        res.status(500).json({ status: 500, message: "Failed to fetch product attributes" });
    }
});

module.exports = {
    handleGetProduct,
    handleGetSingleProduct,
    handleCreateProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleGetProductAttributes
};
