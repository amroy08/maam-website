const express = require("express");
const router = express.Router();
const HeroSlide = require("../Model/heroSlide");
const upload = require("../multer");
const { isAuthenticated, isAdmin } = require("../Middleware/auth");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const fs = require("fs");
const { uploadToR2, deleteFromR2 } = require("../utils/r2");

// Create slide (Admin only)
router.post(
  "/create-slide",
  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"), // Keeps fieldname key same
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (!req.file || !req.file.buffer) {
        return next(new ErrorHandler("Please upload a slide media file", 400));
      }

      const { tag, heading, subHeading, ctaText, ctaLink, align } = req.body;
      const mediaUrl = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype, "heroslides");
      
      // Determine file extension to classify mediaType
      const filename = req.file.originalname.toLowerCase();
      const isVideo = filename.endsWith(".mp4") || filename.endsWith(".webm") || filename.endsWith(".mov") || filename.endsWith(".avi");
      const mediaType = isVideo ? "video" : "image";

      const slide = await HeroSlide.create({
        mediaUrl,
        mediaType,
        tag,
        heading,
        subHeading,
        ctaText,
        ctaLink,
        align,
      });

      res.status(201).json({
        success: true,
        slide,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all slides (Public)
router.get(
  "/get-all-slides",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const slides = await HeroSlide.find().sort({ createdAt: 1 });
      res.status(200).json({
        success: true,
        slides,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update slide (Admin only)
router.put(
  "/update-slide/:id",
  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      let slide = await HeroSlide.findById(req.params.id);
      if (!slide) {
        return next(new ErrorHandler("Slide not found", 404));
      }

      const { tag, heading, subHeading, ctaText, ctaLink, align } = req.body;
      const updateData = { tag, heading, subHeading, ctaText, ctaLink, align };

      // If new image uploaded
      if (req.file && req.file.buffer) {
        if (slide.mediaUrl && slide.mediaUrl.startsWith("http")) {
          await deleteFromR2(slide.mediaUrl);
        } else if (slide.mediaUrl && fs.existsSync(slide.mediaUrl)) {
          fs.unlink(slide.mediaUrl, () => {});
        }
        
        updateData.mediaUrl = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype, "heroslides");
        
        const filename = req.file.originalname.toLowerCase();
        const isVideo = filename.endsWith(".mp4") || filename.endsWith(".webm") || filename.endsWith(".mov") || filename.endsWith(".avi");
        updateData.mediaType = isVideo ? "video" : "image";
      }

      slide = await HeroSlide.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        slide,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Delete slide (Admin only)
router.delete(
  "/delete-slide/:id",
  isAuthenticated,
  isAdmin("admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const slide = await HeroSlide.findById(req.params.id);
      if (!slide) {
        return next(new ErrorHandler("Slide not found", 404));
      }

      if (slide.mediaUrl) {
        if (slide.mediaUrl.startsWith("http")) {
          await deleteFromR2(slide.mediaUrl);
        } else if (fs.existsSync(slide.mediaUrl)) {
          fs.unlink(slide.mediaUrl, () => {});
        }
      }

      await slide.deleteOne();

      res.status(200).json({
        success: true,
        message: "Slide deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
