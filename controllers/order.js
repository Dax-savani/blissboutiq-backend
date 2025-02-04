const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require('../models/order');
const Product = require('../models/product');
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

const handleCreateRazorpayOrder = asyncHandler(async (req, res) => {
    const orders  = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
        return res.status(400).json({ message: "Orders must be a non-empty array" });
    }

    try {
        let totalAmount = 0;
        for (const order of orders) {
            const { product_id, qty } = order;
            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ message: "Product not found", product_id });
            }
            totalAmount += product.price * qty;
        }

        const options = {
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
            receipt: `order_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);
        if (!razorpayOrder) {
            return res.status(400).json({ message: "Failed to create Razorpay order" });
        }

        res.status(201).json({
            message: "Razorpay order created successfully",
            razorpayOrder,
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating Razorpay order", error: err.message });
    }
});

const handleValidateAndPlaceOrder = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orders } = req.body;
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
        return res.status(400).json({ message: "Transaction is not legit!" });
    }

    try {
        const newOrders = orders.map(order => ({
            user_id: req.user._id,
            product_id: order.product_id,
            qty: order.qty,
            status: "paid",
            razorpay_order_id,
            razorpay_payment_id,
        }));

        const createdOrders = await Order.insertMany(newOrders);
        res.status(201).json({
            message: "Transaction is legit! Order placed successfully.",
            orderDetails: createdOrders,
        });
    } catch (err) {
        res.status(500).json({ message: "Error placing order", error: err.message });
    }
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


// const handleAddOrder = asyncHandler(async (req, res) => {
//     const orders = req.body;
//
//     if (!Array.isArray(orders) || orders.length === 0) {
//         return res.status(400).json({status: 400, message: "Orders must be a non-empty array"});
//     }
//
//     try {
//         const newOrders = [];
//
//         for (const order of orders) {
//             const {product_id, qty, color_id, size, status} = order;
//
//             const findedProduct = await Product.findById(product_id);
//             if (!findedProduct) {
//                 return res.status(404).json({status: 404, message: "Product not found", product_id});
//             }
//
//             const selectedColor = findedProduct.color_options.find(option => option._id.equals(color_id));
//             if (!selectedColor) {
//                 return res.status(400).json({status: 400, message: "Invalid color selected", product_id});
//             }
//
//             const selectedSize = selectedColor.size_options.find(option => option.size === size);
//             if (!selectedSize) {
//                 return res.status(400).json({status: 400, message: "Invalid size selected", product_id});
//             }
//
//             if (selectedSize.stock < qty) {
//                 return res.status(400).json({status: 400, message: "Insufficient stock", product_id});
//             }
//
//             selectedSize.stock -= qty;
//             await findedProduct.save();
//
//             newOrders.push({
//                 user_id: req.user._id,
//                 product_id,
//                 color_id,
//                 size,
//                 qty,
//                 status
//             });
//         }
//
//         const createdOrders = await Order.insertMany(newOrders);
//
//         return res.status(201).json({status: 201, message: "Orders placed successfully", data: createdOrders});
//     } catch (err) {
//         return res.status(500).json({status: 500, message: "Failed to place orders", error: err.message});
//     }
// });


module.exports = { handleGetOrder, handleGetSingleOrder , handleValidateAndPlaceOrder , handleCreateRazorpayOrder};