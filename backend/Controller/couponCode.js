const express = require("express");
const {isAuthenticated, isAdmin} = require("../Middleware/auth");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const router = express.Router();
const Shop = require("../Model/shop");
const CouponCode = require("../Model/couponCode");
const ErrorHandler = require("../Utils/ErrorHandler");


// create coupon code — admin only
router.post(
    "/create-coupon-code",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const exists = await CouponCode.findOne({name: req.body.name});
            if (exists) {
                return next(new ErrorHandler("Coupon code already exists!", 400));
            }

            // Auto-attach the store's shop identity
            const shopId = process.env.STORE_SHOP_ID;
            const shop = await Shop.findById(shopId);

            const couponData = {
                ...req.body,
                shop: shop,
            };

            const couponCode = await CouponCode.create(couponData);

            res.status(201).json({
                success: true,
                couponCode,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    })
);


// get all coupons — admin only
router.get(
    "/get-coupon/:id",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const couponCodes = await CouponCode.find({
                "shop._id": req.params.id
            });
            res.status(200).json({
                success: true,
                couponCodes,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete coupon — admin only
router.delete(
    "/delete-coupon/:id",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const coupon = await CouponCode.findByIdAndDelete(req.params.id);
            if (!coupon) {
                return next(new ErrorHandler("Coupon not found!", 404));
            }
            res.status(200).json({
                success: true,
                message: "Coupon deleted successfully!"
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get coupon code value by its name (public — used at checkout)
router.get(
    "/get-coupon-value/:name",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const couponCode = await CouponCode.findOne({name: req.params.name});
            res.status(200).json({
                success: true,
                couponCode,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;
