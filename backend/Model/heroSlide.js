const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema({
    mediaUrl: {
        type: String,
        required: [true, "Please provide slide media file"],
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
        default: "image",
    },
    tag: {
        type: String,
        default: "New Collection",
    },
    heading: {
        type: String,
        required: [true, "Please provide slide heading text"],
    },
    subHeading: {
        type: String,
        default: "",
    },
    ctaText: {
        type: String,
        default: "Shop Now",
    },
    ctaLink: {
        type: String,
        default: "/products",
    },
    align: {
        type: String,
        enum: ["left", "center"],
        default: "left",
    }
}, { timestamps: true });

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
