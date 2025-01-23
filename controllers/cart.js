const Cart = require('../models/cart');
const Product = require('../models/product');
const asyncHandler = require("express-async-handler");

const handleGetCart = asyncHandler(async (req, res) => {
    const cartProducts = await Cart.find({ user_id: req.user._id }).populate('user_id product_id');
    return res.json(cartProducts);
});

const handleGetSingleCart = asyncHandler(async (req, res) => {
    const { cartId } = req.params;
    const cartProduct = await Cart.findOne({ _id: cartId, user_id: req.user._id }).populate('user_id product_id');
    if (!cartProduct) {
        res.status(404);
        throw new Error('Cart item not found');
    }
    return res.json(cartProduct);
});

const handleAddCart = asyncHandler(async (req, res) => {
    const { product_id, qty, color_id, size } = req.body;

    const findedProduct = await Product.findById(product_id);
    if (!findedProduct) {
        return res.status(404).json({ status: 404, message: "Product not found" });
    }

    const isColorValid = findedProduct.color_options.some(option => option._id.toString() === color_id);
    if (!isColorValid) {
        return res.status(400).json({ status: 400, message: "Invalid color selected" });
    }

    const selectedColor = findedProduct.color_options.find(option => option._id.toString() === color_id);
    const isSizeValid = selectedColor.size_options.some(option => option.size === size);
    if (!isSizeValid) {
        return res.status(400).json({ status: 400, message: "Invalid size selected" });
    }

    try {
        const newCart = await Cart.create({
            user_id: req.user._id,
            product_id,
            color_id,
            size,
            qty
        });
        return res.status(201).json({ status: 201, message: 'Product added to Cart', data: newCart });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'Failed to add cart product',
            error: err.message
        });
    }
});

const handleEditCart = asyncHandler(async (req, res) => {
    const { cartId } = req.params;
    const { qty, color_id, size } = req.body;

    if (qty === 0) {
        const removeProduct = await Cart.findOneAndDelete({ _id: cartId, user_id: req.user._id });
        if (!removeProduct) {
            return res.status(404).json({ status: 404, message: "Product not found in cart" });
        }
        return res.status(200).json({ status: 200, message: "Product removed", data: removeProduct });
    }

    if (!qty) {
        return res.status(400).json({ status: 400, message: "Quantity is required" });
    }

    const updatedProduct = await Product.findById(req.body.product_id);
    if (!updatedProduct) {
        return res.status(404).json({ status: 404, message: "Product not found" });
    }

    const isColorValid = updatedProduct.color_options.some(option => option._id.toString() === color_id);
    if (!isColorValid) {
        return res.status(400).json({ status: 400, message: "Invalid color selected" });
    }

    const selectedColor = updatedProduct.color_options.find(option => option._id.toString() === color_id);
    const isSizeValid = selectedColor.size_options.some(option => option.size === size);
    if (!isSizeValid) {
        return res.status(400).json({ status: 400, message: "Invalid size selected" });
    }

    try {
        const updatedCart = await Cart.findOneAndUpdate(
            { _id: cartId, user_id: req.user._id },
            { qty, color_id, size },
            { new: true, runValidators: true }
        );

        if (!updatedCart) {
            return res.status(404).json({ status: 404, message: "Cart product not found" });
        }

        return res.status(200).json({ status: 200, message: "Product updated successfully", data: updatedCart });
    } catch (err) {
        console.error("Error updating cart product", err);
        return res.status(500).json({ status: 500, message: "Error updating cart product", error: err });
    }
});

const handleDeleteCart = asyncHandler(async (req, res) => {
    try {
        const { cartId } = req.params;
        const cartProduct = await Cart.findOne({ _id: cartId, user_id: req.user._id });
        if (!cartProduct) {
            return res.status(404).json({ status: 404, message: "Product not found" });
        }

        const deletedProduct = await Cart.findOneAndDelete({ _id: cartId, user_id: req.user._id });
        return res.status(200).json({ status: 200, message: "Product deleted successfully", data: deletedProduct });
    } catch (err) {
        res.status(500).json({ status: 500, message: "Failed to delete product", error: err.message });
        throw Error("Failed to delete product");
    }
});

module.exports = { handleAddCart, handleEditCart, handleGetCart, handleGetSingleCart, handleDeleteCart };
