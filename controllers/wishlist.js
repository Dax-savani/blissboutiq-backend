const Wishlist = require('../models/wishlist');
const Product = require('../models/product');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const handleGetWishlist = asyncHandler(async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find({user_id: req.user._id}).populate('user_id product_id');
        return res.status(200).json({status: 200, data: wishlistItems});
    } catch (err) {
        console.error("Error fetching wishlist items:", err);
        return res.status(500).json({status: 500, message: "Failed to fetch wishlist items", error: err.message});
    }
});

const handleAddWishlist = asyncHandler(async (req, res) => {
    const {product_id} = req.body;

    try {
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({status: 404, message: 'Product not found'});
        }
        const existingWishlistItem = await Wishlist.findOne({user_id: req.user._id, product_id});
        if (existingWishlistItem) {
            return res.status(400).json({status: 400, message: 'Product already in wishlist'});
        }
        const newWishlistItem = await Wishlist.create({
            user_id: req.user._id,
            product_id,
        });
        product.isWishlisted = true;
        await product.save();

        return res.status(201).json({status: 201, message: 'Product added to wishlist', data: newWishlistItem});
    } catch (err) {
        console.error("Error adding product to wishlist:", err);
        return res.status(500).json({status: 500, message: "Failed to add product to wishlist", error: err.message});
    }
});

const handleRemoveWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ status: 400, message: 'Invalid product ID' });
        }

        const wishlistItem = await Wishlist.findOneAndDelete({ product_id: productId });
        if (!wishlistItem) {
            return res.status(404).json({ status: 404, message: 'Wishlist item not found' });
        }

        const product = await Product.findById(productId);
        if (product) {
            product.isWishlisted = false;
            await product.save();
        }

        return res.status(200).json({ status: 200, message: 'Product removed from wishlist', data: wishlistItem });
    } catch (err) {
        console.error("Error removing product from wishlist:", err);
        return res.status(500).json({
            status: 500,
            message: "Failed to remove product from wishlist",
            error: err.message
        });
    }
});


module.exports = {
    handleGetWishlist,
    handleAddWishlist,
    handleRemoveWishlist,
};
