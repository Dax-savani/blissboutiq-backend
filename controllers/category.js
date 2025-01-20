const Category = require("../models/category");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const {uploadFiles} = require("../helpers/productImage");

const handleGetCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({
            status: 200,
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
});

const handleGetSingleCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);

        if (category) {
            res.status(200).json({
                status: 200,
                message: "Category fetched successfully",
                data: category,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Category not found",
            });
        }
    } catch (error) {
        console.error("Error fetching category:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch category",
            error: error.message,
        });
    }
});


const handleCreateCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file; // Single file

        if (!file) {
            return res.status(400).json({ message: "Category image is required" });
        }

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Category name is required" });
        }

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: "Category name already exists" });
        }

        const imageUrl = await uploadFiles([file.buffer]); // Upload single image

        const category = await Category.create({
            name,
            image: imageUrl[0],
        });

        return res.status(201).json({
            status: 201,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        console.error("Error creating category:", error.message);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});


const handleEditCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        const file = req.file; // Single file

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (name && name.trim() === "") {
            return res.status(400).json({ message: "Invalid category name" });
        }

        let imageUrl = category.image;
        if (file) {
            const uploadedImages = await uploadFiles([file.buffer]); // Upload single image
            imageUrl = uploadedImages[0];
        }

        category.name = name || category.name;
        category.image = imageUrl;

        const updatedCategory = await category.save();

        return res.status(200).json({
            status: 200,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        console.error("Error updating category:", error.message);
        return res.status(500).json({
            status: 500,
            message: "Failed to update category",
            error: error.message,
        });
    }
});


const handleDeleteCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.categoryId);

        if (category) {
            res.status(200).json({
                status: 200,
                message: "Category deleted successfully",
                deletedCategory: category,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Category not found",
            });
        }
    } catch (error) {
        console.error("Error deleting category:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to delete category",
            error: error.message,
        });
    }
});

const handleGetCategoriesByGender = asyncHandler(async (req, res) => {
    try {
        const genders = await Product.distinct("gender");

        const categoriesByGender = await Promise.all(
            genders.map(async (gender) => {
                const products = await Product.find({ gender }).populate("category");

                const uniqueCategories = [];
                const categorySet = new Set();

                products.forEach((product) => {
                    const { name, image } = product.category || {};
                    if (product.category && !categorySet.has(name)) {
                        categorySet.add(name);
                        uniqueCategories.push({ name, image });
                    }
                });

                return {
                    gender,
                    categories: uniqueCategories,
                };
            })
        );

        res.status(200).json({
            status: 200,
            message: "Categories fetched successfully by gender",
            data: categoriesByGender,
        });
    } catch (error) {
        console.error("Error fetching categories by gender:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch categories by gender",
            error: error.message,
        });
    }
});

module.exports = {
    handleGetCategories,
    handleGetSingleCategory,
    handleGetCategoriesByGender,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
};
