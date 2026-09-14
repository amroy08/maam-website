const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { NodeHttpHandler } = require("@smithy/node-http-handler");
const https = require("https");
const path = require("path");

const agent = new https.Agent({
    minVersion: "TLSv1.2",
    maxVersion: "TLSv1.3",
});

const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
    requestHandler: new NodeHttpHandler({
        httpsAgent: agent,
    }),
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "divinesoul-bucket";
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://pub-ae6ede28a90d4c4b8d6e868e398d0797.r2.dev";

/**
 * Upload a buffer directly to Cloudflare R2
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimeType
 * @param {string} folder
 * @returns {Promise<string>} Public URL of the uploaded image
 */
const uploadToR2 = async (fileBuffer, originalName, mimeType, folder = "products") => {
    const ext = path.extname(originalName) || ".jpg";
    const uniqueName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: uniqueName,
        Body: fileBuffer,
        ContentType: mimeType,
    });

    await r2Client.send(command);
    return `${PUBLIC_URL}/${uniqueName}`;
};

/**
 * Delete an object from Cloudflare R2 given its Key or full URL
 * @param {string} keyOrUrl
 */
const deleteFromR2 = async (keyOrUrl) => {
    if (!keyOrUrl) return;
    try {
        let key = keyOrUrl;
        if (keyOrUrl.startsWith("http")) {
            const urlObj = new URL(keyOrUrl);
            key = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;
        }

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await r2Client.send(command);
    } catch (err) {
        console.error("Cloudflare R2 delete error:", err);
    }
};

module.exports = {
    r2Client,
    uploadToR2,
    deleteFromR2,
    PUBLIC_URL,
};
