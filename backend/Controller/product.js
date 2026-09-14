const express = require("express");
const {isAuthenticated, isAdmin} = require("../Middleware/auth");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../Model/product");
const Shop = require("../Model/shop");
const Order = require("../Model/order");
const ErrorHandler = require("../Utils/ErrorHandler");
const upload = require("../multer");
const fs = require("fs");
const { uploadToR2, deleteFromR2 } = require("../utils/r2");

// create product — admin only, auto-injects the store's shopId
router.post(
    "/create-product",
    isAuthenticated,
    isAdmin("admin"),
    upload.array("images"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shopId = process.env.STORE_SHOP_ID;
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return next(new ErrorHandler("Store not configured. Please contact the administrator.", 400));
            }

            const files = req.files || [];
            const imageUrls = [];

            for (const file of files) {
                if (file.buffer) {
                    const url = await uploadToR2(file.buffer, file.originalname, file.mimetype, "products");
                    imageUrls.push(url);
                }
            }

            const productData = req.body;
            productData.images = imageUrls;
            productData.shopId = shopId;
            productData.shop = shop;

            const product = await Product.create(productData);

            res.status(201).json({
                success: true,
                product,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get all products of the store (used internally for dashboard)
router.get(
    "/get-all-products-shop/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find({shopId: req.params.id});

            res.status(201).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete product of a shop
router.delete(
    "/delete-shop-product/:id",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productId = req.params.id;

            const productData = await Product.findById(productId);

            if (!productData) {
                return next(new ErrorHandler("Product not found with this id", 404));
            }

            // Delete associated images from Cloudflare R2 or local
            if (productData.images && productData.images.length > 0) {
                for (const image of productData.images) {
                    if (image.startsWith("http")) {
                        await deleteFromR2(image);
                    } else {
                        const filePath = `uploads/${image}`;
                        if (fs.existsSync(filePath)) {
                            fs.unlink(filePath, () => {});
                        }
                    }
                }
            }

            const product = await Product.findByIdAndDelete(productId);

            if (!product) {
                return next(new ErrorHandler("Product is not found with this id", 500));
            }

            res.status(200).json({
                success: true,
                message: "Product deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// update product — admin only
router.put(
    "/update-product/:id",
    isAuthenticated,
    isAdmin("admin"),
    upload.array("images", 3),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productId = req.params.id;
            let product = await Product.findById(productId);
            if (!product) {
                return next(new ErrorHandler("Product not found with this id", 404));
            }

            const updateData = {...req.body};
            
            // Reconstruct images array based on preservation and uploads
            let finalImages = [...product.images];
            
            // If user selected specific indexes to delete/replace
            if (req.body.keepImages) {
                // keepImages is passed as JSON string from client, parsing it
                const keepIndexes = JSON.parse(req.body.keepImages); // array of indices or filenames to retain
                finalImages = finalImages.filter((img, idx) => keepIndexes.includes(idx));
            }

            if (req.files && req.files.length > 0) {
                const uploadedFiles = req.files.map((file) => file.filename);
                
                // If a replacement map is specified (e.g. index 1 replaced by file 0)
                if (req.body.replaceIndexMap) {
                    const replaceMap = JSON.parse(req.body.replaceIndexMap); // map of { originalIndex: uploadFileIndex }
                    let fileIdx = 0;
                    Object.keys(replaceMap).forEach((origIdx) => {
                        finalImages[origIdx] = uploadedFiles[fileIdx++];
                    });
                    // Append remaining files
                    for(let i=fileIdx; i<uploadedFiles.length; i++) {
                        finalImages.push(uploadedFiles[i]);
                    }
                } else {
                    // Default behavior: append new uploads
                    finalImages = [...finalImages, ...uploadedFiles].slice(0, 3);
                }
            }

            updateData.images = finalImages.filter(Boolean);

            product = await Product.findByIdAndUpdate(productId, updateData, {
                new: true,
                runValidators: true,
            });

            res.status(200).json({
                success: true,
                message: "Product updated successfully!",
                product,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    })
);


// get all products (public storefront)
router.get(
    "/get-all-products",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({createdAt: -1});

            res.status(201).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// Get a single product by ID
router.get(
    `/:id`,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id);
            res.status(200).json({
                success: true,
                product,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// review for a product
router.put(
    "/create-new-review",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const {user, rating, comment, productId, orderId} = req.body;

            const product = await Product.findById(productId);

            const review = {
                user,
                rating,
                comment,
                productId,
            };

            const isReviewed = product.reviews.find(
                (rev) => rev.user._id === req.user._id
            );

            if (isReviewed) {
                product.reviews.forEach((rev) => {
                    if (rev.user._id === req.user._id) {
                        (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                    }
                });
            } else {
                product.reviews.push(review);
            }

            let avg = 0;
            product.reviews.forEach((rev) => {
                avg += rev.rating;
            });
            product.ratings = avg / product.reviews.length;

            await product.save({validateBeforeSave: false});

            await Order.findByIdAndUpdate(
                orderId,
                {$set: {"cart.$[elem].isReviewed": true}},
                {arrayFilters: [{"elem._id": productId}], new: true}
            );

            res.status(200).json({
                success: true,
                message: "Reviewed successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// all products --- for admin
router.get(
    "/admin-all-products",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);


// delete review --- for admin
router.delete(
    "/delete-review/:productId/:reviewId",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { productId, reviewId } = req.params;
            const product = await Product.findById(productId);

            if (!product) {
                return next(new ErrorHandler("Product not found", 404));
            }

            // Filter out the review to delete
            const reviews = product.reviews.filter(
                (rev) => rev._id.toString() !== reviewId
            );

            product.reviews = reviews;

            // Recalculate ratings average
            if (product.reviews.length === 0) {
                product.ratings = 0;
            } else {
                let avg = 0;
                product.reviews.forEach((rev) => {
                    avg += rev.rating;
                });
                product.ratings = avg / product.reviews.length;
            }

            await product.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                message: "Review deleted successfully by admin!",
                product
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    })
);


module.exports = router;
