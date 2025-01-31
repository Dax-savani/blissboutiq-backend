const Order = require('../models/order');
const Product = require('../models/product');
const asyncHandler = require("express-async-handler");

const handleGetOrder = asyncHandler(async (req, res) => {
    const orderProducts = await Order.find({ user_id: req.user._id }).populate('user_id product_id');
    return res.json(orderProducts);
});

const handleGetSingleOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const orderProduct = await Order.findOne({ _id: orderId, user_id: req.user._id }).populate('user_id product_id');
    if (!orderProduct) {
        res.status(404);
        throw new Error('Order not found');
    }
    return res.json(orderProduct);
});

const handleAddOrder = asyncHandler(async (req, res) => {
    const { product_id, qty, color_id, size, status } = req.body;

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
        const newOrder = await Order.create({
            user_id: req.user._id,
            product_id,
            color_id,
            size,
            qty,
            status
        });
        return res.status(201).json({ status: 201, message: 'Order placed successfully', data: newOrder });
    } catch (err) {
        return res.status(500).json({ status: 500, message: 'Failed to place order', error: err.message });
    }
});

const handleEditOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const validStatuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(400);
            throw new Error('Invalid order status');
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, user_id: req.user._id },
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) return res.status(404).json({ status: 404, message: "Order not found" });

        return res.status(200).json({ status: 200, message: "Order updated successfully", data: updatedOrder });
    } catch (err) {
        return res.status(500).json({ status: 500, message: "Error updating order", error: err.message });
    }
});

module.exports = { handleAddOrder, handleGetOrder, handleGetSingleOrder, handleEditOrder };