const Order = require('../models/order');
const Product = require('../models/product');
const asyncHandler = require("express-async-handler");

const handleGetOrder = asyncHandler(async (req, res) => {
    const orderProducts = await Order.find({user_id: req.user._id})
        .populate({
            path: 'product_id',
            populate: {
                path: 'subcategory',
                populate: {path: 'category'}
            }
        });

    return res.json(orderProducts);
});


const handleGetSingleOrder = asyncHandler(async (req, res) => {
    const {orderId} = req.params;

    const orderProduct = await Order.findOne({_id: orderId, user_id: req.user._id})
        .populate({
            path: 'product_id',
            populate: {
                path: 'subcategory',
                populate: {path: 'category'}
            }
        });

    if (!orderProduct) {
        return res.status(404).json({status: 404, message: "Order not found"});
    }

    return res.json(orderProduct);
});


const handleAddOrder = asyncHandler(async (req, res) => {
    const orders = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
        return res.status(400).json({status: 400, message: "Orders must be a non-empty array"});
    }

    try {
        const newOrders = [];

        for (const order of orders) {
            const {product_id, qty, color_id, size, status} = order;

            const findedProduct = await Product.findById(product_id);
            if (!findedProduct) {
                return res.status(404).json({status: 404, message: "Product not found", product_id});
            }

            const selectedColor = findedProduct.color_options.find(option => option._id.equals(color_id));
            if (!selectedColor) {
                return res.status(400).json({status: 400, message: "Invalid color selected", product_id});
            }

            const selectedSize = selectedColor.size_options.find(option => option.size === size);
            if (!selectedSize) {
                return res.status(400).json({status: 400, message: "Invalid size selected", product_id});
            }

            if (selectedSize.stock < qty) {
                return res.status(400).json({status: 400, message: "Insufficient stock", product_id});
            }

            selectedSize.stock -= qty;
            await findedProduct.save();

            newOrders.push({
                user_id: req.user._id,
                product_id,
                color_id,
                size,
                qty,
                status
            });
        }

        const createdOrders = await Order.insertMany(newOrders);

        return res.status(201).json({status: 201, message: "Orders placed successfully", data: createdOrders});
    } catch (err) {
        return res.status(500).json({status: 500, message: "Failed to place orders", error: err.message});
    }
});


module.exports = {handleAddOrder, handleGetOrder, handleGetSingleOrder};