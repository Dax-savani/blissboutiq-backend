const Cart = require('../models/cart');
const asyncHandler = require("express-async-handler");

const handleGetCart = asyncHandler(async (req,res) => {
    const cartProducts = await Cart.find().populate('product_id');
    return res.json(cartProducts);
})

const handleGetSingleCart = asyncHandler(async (req,res) => {
    const {cartId} = req.params;
    const cartProduct = await Cart.findById(cartId).populate('product_id');
    if(!cartProduct) {
        res.status(404)
        throw new Error('Cart item not found');
    }
    return res.json(cartProduct);
})


const handleAddCart = asyncHandler(async (req, res) => {
    const {product_id, qty} = req.body;
    try {
        const newCart = await Cart.create({
            user_id: req.user._id,
            product_id,
            qty
        })
        return res.status(201).json({status: 201, message: 'Product added to Cart', data: newCart})
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: 'Fail to add cart product',
            error: err.message
        })
    }
});

const handleEditCart = asyncHandler(async (req, res) => {
    const {cartId} = req.params;
    const {qty} = req.body;

    if (!qty) return res.status(400).json({status: 400, message: "Quantity is required"});

    if(qty == 0) {
        await Cart.findByIdAndDelete(cartId);
    }

    try {
        const updatedCart = await Cart.findByIdAndUpdate(cartId, {qty}, {new: true, runValidators: true});

        if (!updatedCart) return res.status(404).json({status: 404, message: "Cart Product not found"});

        return res.status(200).json({status: 200, message: "Product updated successfully", data: updatedCart})

    } catch (err) {
        console.error("Error updating cart product",err);
        return res.status(500).json({status: 500,message: "Error updating cart product",error: err})
    }
})

const handleDeleteCart = asyncHandler(async (req,res) => {
    try{
        const {cartId} = req.params;
        const cartProduct = await Cart.findById(cartId);
        if(!cartProduct) return res.status(404).json({status: 404,message: "Product not found"});

        const deletedProduct = await Cart.findByIdAndDelete(cartId);
        return res.status(200).json({status: 200,message: "Product deleted successfully",data: deletedProduct});
    } catch(err){
        throw Error("Failed to delete Product");
        res.status(500).json({status:500,message: "Failed to delete Product",error: err.message});
    }
})

module.exports = {handleAddCart , handleEditCart , handleGetCart ,handleGetSingleCart ,handleDeleteCart}