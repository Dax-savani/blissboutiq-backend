const Category = require("../models/category");

const handleGetCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch categories" });
    }
};

const handleGetSingleCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch category" });
    }
};

const handleCreateCategory = async (req, res) => {
    try {
        const { name, image } = req.body;

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: "Category name already exists" });
        }

        const category = await Category.create({ name, image });
        if (category) {
            res.status(201).json(category);
        } else {
            res.status(400).json({ message: "Invalid category data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to create category" });
    }
};

const handleEditCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, image } = req.body;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        category.name = name || category.name;
        category.image = image || category.image;

        const updatedCategory = await category.save();

        res.json({
            status: 200,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to update category" });
    }
};

const handleDeleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.categoryId);

        if (category) {
            res.json({
                message: "Category removed",
                deletedCategory: category,
            });
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to delete category" });
    }
};

module.exports = {
    handleGetCategories,
    handleGetSingleCategory,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
};
