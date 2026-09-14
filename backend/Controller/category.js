const express = require("express");
const Category = require("../Model/category");
const {isAuthenticated, isAdmin} = require("../Middleware/auth");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const upload = require("../multer");
const fs = require("fs");
const { uploadToR2, deleteFromR2 } = require("../utils/r2");
const router = express.Router();

// create category
router.post(
    "/create-category",
    isAuthenticated,
    isAdmin("admin"),
    upload.single("image"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const {name, description} = req.body;
            const exists = await Category.findOne({name});
            if (exists) {
                return next(new ErrorHandler("Category already exists!", 400));
            }

            let image = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop";
            if (req.file && req.file.buffer) {
                image = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype, "categories");
            }

            const category = await Category.create({
                name,
                description,
                image,
            });

            res.status(201).json({
                success: true,
                category,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    })
);

// get all categories
router.get(
    "/get-all-categories",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const categories = await Category.find().sort({createdAt: -1});
            res.status(200).json({
                success: true,
                categories,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update category
router.put(
    "/update-category/:id",
    isAuthenticated,
    isAdmin("admin"),
    upload.single("image"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const {name, description} = req.body;
            const category = await Category.findById(req.params.id);

            if (!category) {
                return next(new ErrorHandler("Category not found", 404));
            }

            category.name = name || category.name;
            category.description = description || category.description;

            if (req.file && req.file.buffer) {
                if (category.image && category.image.startsWith("http")) {
                    await deleteFromR2(category.image);
                }
                category.image = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype, "categories");
            }

            await category.save();

            res.status(200).json({
                success: true,
                category,
                message: "Category updated successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    })
);

// delete category
router.delete(
    "/delete-category/:id",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                return next(new ErrorHandler("Category not found", 404));
            }

            if (category.image) {
                if (category.image.startsWith("http")) {
                    await deleteFromR2(category.image);
                } else if (category.image !== "uploads/default.png" && fs.existsSync(category.image)) {
                    fs.unlink(category.image, () => {});
                }
            }

            await Category.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: "Category deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    })
);

module.exports = router;
