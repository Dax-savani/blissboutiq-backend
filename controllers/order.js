const Order = require('../models/order');
const Product = require('../models/product');
const asyncHandler = require("express-async-handler");

const handleGetOrder = asyncHandler(async (req, res) => {
    const orderProducts = await Order.find({ user_id: req.user._id })
        .populate({
            path: 'product_id',
            populate: {
                path: 'subcategory',
                populate: { path: 'category' }
            }
        });

    return res.json(orderProducts);
});


const handleGetSingleOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const orderProduct = await Order.findOne({ _id: orderId, user_id: req.user._id })
        .populate({
            path: 'product_id',
            populate: {
                path: 'subcategory',
                populate: { path: 'category' }
            }
        });

    if (!orderProduct) {
        return res.status(404).json({ status: 404, message: "Order not found" });
    }

    return res.json(orderProduct);
});


const handleAddOrder = asyncHandler(async (req, res) => {
    const { product_id, qty, color_id, size, status } = req.body;

    const findedProduct = await Product.findById(product_id);
    if (!findedProduct) {
        return res.status(404).json({ status: 404, message: "Product not found" });
    }

    const selectedColor = findedProduct.color_options.find(option => option._id.equals(color_id));
    if (!selectedColor) {
        return res.status(400).json({ status: 400, message: "Invalid color selected" });
    }

    const selectedSize = selectedColor.size_options.find(option => option.size === size);
    if (!selectedSize) {
        return res.status(400).json({ status: 400, message: "Invalid size selected" });
    }

    if (selectedSize.stock < qty) {
        return res.status(400).json({ status: 400, message: "Insufficient stock" });
    }

    try {

        selectedSize.stock -= qty;
        await findedProduct.save();

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
            return res.status(400).json({ status: 400, message: 'Invalid order status' });
        }

        const order = await Order.findOne({ _id: orderId, user_id: req.user._id });
        if (!order) return res.status(404).json({ status: 404, message: "Order not found" });


        if (status === 'cancelled' && order.status !== 'cancelled') {
            const product = await Product.findById(order.product_id);
            if (product) {
                const colorOption = product.color_options.find(option => option._id.equals(order.color_id));
                if (colorOption) {
                    const sizeOption = colorOption.size_options.find(option => option.size === order.size);
                    if (sizeOption) {
                        sizeOption.stock += order.qty;
                        await product.save();
                    }
                }
            }
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ status: 200, message: "Order updated successfully", data: order });
    } catch (err) {
        return res.status(500).json({ status: 500, message: "Error updating order", error: err.message });
    }
});


module.exports = { handleAddOrder, handleGetOrder, handleGetSingleOrder, handleEditOrder };