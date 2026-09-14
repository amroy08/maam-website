const multer = require("multer");

// Use memory storage so files are held as Buffers in memory
// and uploaded directly to Cloudflare R2 (serverless-compatible, no local disk needed)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB limit
    },
});

module.exports = upload;
