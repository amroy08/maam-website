const express = require("express");
const {isAuthenticated, isAdmin} = require("../Middleware/auth");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const router = express.Router();
const Event = require("../Model/event");
const Shop = require("../Model/shop");
const ErrorHandler = require("../Utils/ErrorHandler");
const upload = require("../multer");
const fs = require("fs");
const { uploadToR2, deleteFromR2 } = require("../utils/r2");


// create event — admin only, auto-injects store shopId
router.post(
    "/create-event",
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
                    const url = await uploadToR2(file.buffer, file.originalname, file.mimetype, "events");
                    imageUrls.push(url);
                }
            }

            const eventData = req.body;
            eventData.images = imageUrls;
            eventData.shopId = shopId;
            eventData.shop = shop;

            const product = await Event.create(eventData);

            res.status(201).json({
                success: true,
                product,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);


// get all events for the store
router.get(
    "/get-all-events/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const events = await Event.find({shopId: req.params.id});

            res.status(201).json({
                success: true,
                events,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);


// delete event — admin only
router.delete(
    "/delete-shop-event/:id",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const eventId = req.params.id;

            const eventData = await Event.findById(eventId);

            if (!eventData) {
                return next(new ErrorHandler("Event not found with this id", 404));
            }

            if (eventData.images && eventData.images.length > 0) {
                for (const image of eventData.images) {
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

            const event = await Event.findByIdAndDelete(eventId);

            if (!event) {
                return next(new ErrorHandler("Event is not found with this id", 500));
            }

            res.status(200).json({
                success: true,
                message: "Event deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// update event — admin only
router.put(
    "/update-event/:id",
    isAuthenticated,
    isAdmin("admin"),
    upload.array("images"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const eventId = req.params.id;
            let event = await Event.findById(eventId);
            if (!event) {
                return next(new ErrorHandler("Event not found with this id", 404));
            }

            const updateData = {...req.body};
            if (req.files && req.files.length > 0) {
                const imageUrls = req.files.map((file) => `${file.filename}`);
                updateData.images = imageUrls;
            }

            event = await Event.findByIdAndUpdate(eventId, updateData, {
                new: true,
                runValidators: true,
            });

            res.status(200).json({
                success: true,
                message: "Event updated successfully!",
                event,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get all events (public)
router.get("/get-all-events", async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

// all events --- for admin
router.get(
    "/admin-all-events",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const events = await Event.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                events,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;
