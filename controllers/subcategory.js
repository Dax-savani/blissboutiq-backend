const Subcategory = require("../models/subcategory");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");


const handleGetSubcategories = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        const subcategories = await Subcategory.find({ category:categoryId });

        res.status(200).json({
            status: 200,
            message: "Subcategories fetched successfully",
            data: subcategories,
        });
    } catch (error) {
        console.error("Error fetching subcategories:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch subcategories",
            error: error.message,
        });
    }
});
const handleGetSubcategoriesGroupedByCategory = asyncHandler(async (req, res) => {
    try {
        const subcategoriesGrouped = await Subcategory.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $unwind: "$categoryDetails",
            },
            {
                $group: {
                    _id: "$categoryDetails._id",
                    categoryName: { $first: "$categoryDetails.name" },
                    subcategories: {
                        $push: {
                            _id: "$_id",
                            name: "$name",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    categoryName: 1,
                    subcategories: 1,
                },
            },
        ]);

        res.status(200).json({
            status: 200,
            message: "Subcategories grouped by category fetched successfully",
            data: subcategoriesGrouped,
        });
    } catch (error) {
        console.error("Error fetching grouped subcategories:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch grouped subcategories",
            error: error.message,
        });
    }
});

const handleGetSingleSubcategory = asyncHandler(async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        const subcategory = await Subcategory.findById(subcategoryId).populate('category', 'name image');

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({
            status: 200,
            message: "Subcategory fetched successfully",
            data: subcategory,
        });
    } catch (error) {
        console.error("Error fetching subcategory:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch subcategory",
            error: error.message,
        });
    }
});

const handleAddSubcategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Subcategory name is required" });
        }
        if (!categoryId) {
            return res.status(400).json({ message: "Category is required" });
        }
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }
        const subcategoryExists = await Subcategory.findOne({
            name,
            category:categoryId,
        });
        if (subcategoryExists) {
            return res.status(400).json({ message: "Subcategory already exists" });
        }
        const subcategory = await Subcategory.create({
            name,
            category: categoryId,
        });
        res.status(201).json({
            status: 201,
            message: "Subcategory created successfully",
            data: subcategory
        });
    } catch (error) {
        console.error("Error creating subcategory:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to create subcategory",
            error: error.message,
        });
    }
});


const handleEditSubcategory = asyncHandler(async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "New subcategory name is required" });
        }

        const subcategory = await Subcategory.findById(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        subcategory.name = name;
        const updatedSubcategory = await subcategory.save();

        res.status(200).json({
            status: 200,
            message: "Subcategory updated successfully",
            data: updatedSubcategory,
        });
    } catch (error) {
        console.error("Error updating subcategory:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to update subcategory",
            error: error.message,
        });
    }
});

const handleDeleteSubcategory = asyncHandler(async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        const subcategory = await Subcategory.findByIdAndDelete(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({
            status: 200,
            message: "Subcategory deleted successfully",
            data: subcategory,
        });
    } catch (error) {
        console.error("Error deleting subcategory:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to delete subcategory",
            error: error.message,
        });
    }
});

module.exports = {
    handleGetSubcategories,
    handleAddSubcategory,
    handleEditSubcategory,
    handleGetSingleSubcategory,
    handleDeleteSubcategory,
    handleGetSubcategoriesGroupedByCategory
};
