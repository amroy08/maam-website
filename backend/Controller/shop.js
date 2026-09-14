const express = require("express");
const Shop = require("../Model/shop");
const router = express.Router();
const upload = require("../multer");
const fs = require("fs");
const ErrorHandler = require("../Utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const sendMail = require("../Utils/sendMail");
const sendShopToken = require("../Utils/shopToken");
const {isShop, isAuthenticated, isAdmin} = require("../Middleware/auth");
const { uploadToR2, deleteFromR2 } = require("../utils/r2");

// create shop
router.post("/create-shop", upload.single("avatar"), async (req, res, next) => {
    try {
        console.log("📩 Incoming Request:", req.body);

        const { name, email, password, phoneNumber, zipCode, address } = req.body;

        // Check if seller already exists
        const existingShop = await Shop.findOne({ email });
        if (existingShop) {
            console.log("🚫 Seller already exists:", email);
            return next(new ErrorHandler("Seller already exists", 400));
        }

        let fileUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop";
        if (req.file && req.file.buffer) {
            fileUrl = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype, "shops");
        }

        // Create user object
        const shop = new Shop({
            name,
            email,
            password,
            phoneNumber,
            zipCode,
            address,
            avatar: fileUrl,
        });


        // Generate activation token
        const activationToken = createActivationToken(shop);

        // Activation URL
        const activationUrl = `${process.env.FRONTEND_URL}/shop/activation/${activationToken}`;


        try {
            await sendMail({
                email: shop.email,
                subject: "Activate your Shop",
                html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <title> Email for Activation </title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f7f9fc;">
                <table style="max-width: 600px; margin: 40px auto;">
                    <tr>
                        <td style="padding: 40px 30px; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <table style="width: 100%;">
                                <tr>
                                    <td style="text-align: center; padding-bottom: 30px;">
                                        <img src="https://cdn.shopify.com/s/files/1/0412/5117/6615/files/The_Artisan_Marketplace_-_Logo_1caa2512-2a37-417f-948e-bb571f16e582.jpg" alt="Company Logo" width="150" style="max-width: 150px;">
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #1a1a1a;">
                                        <h1 style="font-size: 24px; margin: 0 0 25px; color: #2d3436; text-align: center;">Welcome to DivineSoul!</h1>
                                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Hi ${shop.name},</p>
                                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px;">Thank you for creating a seller account. Please click the button below to verify your email address and activate your shop.</p>
                                        <div style="text-align: center; margin: 40px 0;">
                                            <a href="${activationUrl}" style="background-color: #4361ee; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(67,97,238,0.25);">Activate Account</a>
                                        </div>
                                        <p style="font-size: 14px; line-height: 1.6; margin: 30px 0 0; color: #666;">
                                            If you didn't create this account, you can safely ignore this email.
                                            <br>Need help? Contact our <a href="mailto:crisiscrush525@gmail.com" style="color: #4361ee; text-decoration: none;">support team</a>.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 25px 30px; text-align: center;">
                            <p style="font-size: 12px; color: #666; margin: 0;">
                                © ${new Date().getFullYear()} DivineSoul. All rights reserved.
                                <br>123 Market Street, Suite 456, Creative City, CC 7890
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `,
            });

            console.log("📧 Activation email sent to:", shop.email);

            res.status(201).json({
                success: true,
                message: `Please check your email: ${shop.email} to activate your shop!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        console.log("❌ Error creating seller:", error.message);
        return next(new ErrorHandler(error.message, 400));
    }
});


const createActivationToken = (shop) => {
    const payload = {
        name: shop.name,
        email: shop.email,
        password: shop.password,
        zipCode: shop.zipCode,
        address: shop.address,
        phoneNumber: shop.phoneNumber,
        avatar: shop.avatar,
    };
    return jwt.sign(payload, process.env.ACTIVATION_SECRET, {
        expiresIn: "10m",
    });
};

// Activate user
router.get("/activation/:activation_token", async (req, res) => {
    try {
        console.log("🔗 Activation Request Received!");
        const { activation_token } = req.params;
        console.log("📌 Received Token:", activation_token);

        const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        console.log("✅ Decoded Token:", decoded);

        const existingSeller = await Shop.findOne({ email: decoded.email });
        if (existingSeller) {
            console.log("🚫 Seller already exists!");
            return res.status(400).json({ message: "Seller already exists!" });
        }

        console.log("🛠️ Creating New Seller...");
        const shop = await Shop.create({ ...decoded });
        console.log("🎉 Seller Created:", shop);

        sendShopToken(shop, 200, res);
    } catch (error) {
        console.error("❌ Activation Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
});

//login user
router.post(
    "/login-shop",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(new ErrorHandler("Please provide the all fields!", 400));
            }

            const shop = await Shop.findOne({ email }).select("+password");

            if (!shop) {
                return next(new ErrorHandler("Seller doesn't exists!", 400));
            }

            const isPasswordValid = await shop.comparePassword(password);

            if (!isPasswordValid) {
                return next(
                    new ErrorHandler("Please provide the correct information", 400)
                );
            }

            sendShopToken(shop, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// load shop
router.get(`/getShop`,
    isShop,
    async (req, res, next) => {
        try {
            const shop = await Shop.findById(req.shop._id);
            if (!shop) {
                return next(new ErrorHandler(`Shop doesn't exists!`));
            }

            res.status(200).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    });


// log out user
router.get(
    "/logout",
    isShop,
    catchAsyncErrors(async (req, res, next) => {
        try {
            res.cookie("shopToken", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.status(201).json({
                success: true,
                message: "Log out successful!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);


// get Shop Info
router.get(
    `/get-shop-info/:id`,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shop = await Shop.findById(req.params.id);
            res.status(200).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);


// // update shop profile picture
// router.put(
//     "/update-shop-avatar",
//     isSeller,
//     catchAsyncErrors(async (req, res, next) => {
//         try {
//             let existsSeller = await Shop.findById(req.seller._id);
//
//             const imageId = existsSeller.avatar.public_id;
//
//             await cloudinary.v2.uploader.destroy(imageId);
//
//             const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//                 folder: "avatars",
//                 width: 150,
//             });
//
//             existsSeller.avatar = {
//                 public_id: myCloud.public_id,
//                 url: myCloud.secure_url,
//             };
//
//
//             await existsSeller.save();
//
//             res.status(200).json({
//                 success: true,
//                 seller:existsSeller,
//             });
//         } catch (error) {
//             return next(new ErrorHandler(error.message, 500));
//         }
//     })
// );
//
// update seller info
router.put(
    "/update-seller-info",
    isShop,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { name, description, address, phoneNumber, zipCode } = req.body;

            const shop = await Shop.findOne(req.shop._id);

            if (!shop) {
                return next(new ErrorHandler("User not found", 400));
            }

            shop.name = name;
            shop.description = description;
            shop.address = address;
            shop.phoneNumber = phoneNumber;
            shop.zipCode = zipCode;

            await shop.save();

            res.status(201).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// all sellers --- for admin
router.get(
    "/admin-all-sellers",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shops = await Shop.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                shops,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete seller ---admin
router.delete(
    "/delete-seller/:id",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shop = await Shop.findById(req.params.id);

            if (!shop) {
                return next(
                    new ErrorHandler("Seller is not available with this id", 400)
                );
            }

            await Shop.findByIdAndDelete(req.params.id);

            res.status(201).json({
                success: true,
                message: "Seller deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);
//
// update seller withdraw methods --- sellers
router.put(
    "/update-payment-methods",
    isShop,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { withdrawMethod } = req.body;

            const shop = await Shop.findByIdAndUpdate(req.shop._id, {
                withdrawMethod,
            });

            res.status(201).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete seller withdraw methods --- only seller
router.delete(
    "/delete-withdraw-method",
    isShop,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shop = await Shop.findById(req.shop._id);

            if (!shop) {
                return next(new ErrorHandler("Shop not found with this id", 400));
            }

            shop.withdrawMethod = null;

            await shop.save();

            res.status(201).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;
