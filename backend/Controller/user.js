const express = require("express");
const User = require("../Model/user");
const router = express.Router();
const upload = require("../multer");
const fs = require("fs");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../Utils/sendMail");
const sendToken = require("../Utils/sendToken");
const {isAuthenticated, isAdmin} = require("../Middleware/auth");
const { uploadToR2, deleteFromR2 } = require("../utils/r2");

// Create and activate user
router.post("/create-user", upload.single("avatar"), async (req, res, next) => {
    try {
        console.log("📩 Incoming Request:", req.body);

        const {name, email, password} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            console.log("🚫 User already exists:", email);
            return next(new ErrorHandler("User already exists", 400));
        }

        let fileUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop";
        if (req.file && req.file.buffer) {
            fileUrl = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype, "avatars");
        }

        // Create user object directly
        const user = await User.create({
            name,
            email,
            password,
            avatar: fileUrl,
        });

        sendToken(user, 201, res);
    } catch (error) {
        console.log("❌ Error creating user:", error.message);
        return next(new ErrorHandler(error.message, 400));
    }
});


const createActivationToken = (user) => {
    const payload = {
        name: user.name,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
    };
    return jwt.sign(payload, process.env.ACTIVATION_SECRET, {
        expiresIn: "10m",
    });
};

// Activate user
router.get(
    "/activation/:activation_token",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const {activation_token} = req.params;
            const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

            // Check if user already exists
            const existingUser = await User.findOne({email: decoded.email});
            if (existingUser) {
                return next(new ErrorHandler("User already exists!", 400)); // Graceful error
            }

            // Create user if they don't exist
            const user = await User.create({...decoded});
            sendToken(user, 200, res); // Send token and response

        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

//login user
router.post(
    "/login-user",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return next(new ErrorHandler("Please provide the all fields!", 400));
            }

            const user = await User.findOne({email}).select("+password");

            if (!user) {
                return next(new ErrorHandler("User doesn't exists!", 400));
            }

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return next(
                    new ErrorHandler("Please provide the correct information", 400)
                );
            }

            sendToken(user, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// load user
router.get(`/getUser`,
    isAuthenticated,
    async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return next(new ErrorHandler(`User doesn't exists!`));
            }

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    });


// log out user
router.get(
    "/logout",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            res.cookie("token", null, {
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


// update user info
router.put(
    "/update-user-info",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const {email, password, phoneNumber, name} = req.body;

            const user = await User.findOne({email}).select("+password");

            if (!user) {
                return next(new ErrorHandler("User not found", 400));
            }

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return next(
                    new ErrorHandler("Please provide the correct information", 400)
                );
            }

            user.name = name;
            user.email = email;
            user.phoneNumber = phoneNumber;

            await user.save();

            res.status(201).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);


// update user addresses
router.put(
    "/update-user-addresses",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            const sameTypeAddress = user.addresses.find(
                (address) => address.addressType === req.body.addressType
            );
            if (sameTypeAddress) {
                return next(
                    new ErrorHandler(`${req.body.addressType} address already exists`)
                );
            }

            const existsAddress = user.addresses.find(
                (address) => address._id === req.body._id
            );

            if (existsAddress) {
                Object.assign(existsAddress, req.body);
            } else {
                // add the new address to the array
                user.addresses.push(req.body);
            }

            await user.save();

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user information with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// all users --- for admin
router.get(
    "/admin-all-users",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const users = await User.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                users,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete users --- admin
router.delete(
    "/delete-user/:id",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return next(
                    new ErrorHandler("User is not available with this id", 400)
                );
            }

            await User.findByIdAndDelete(req.params.id);

            res.status(201).json({
                success: true,
                message: "User deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);



// update user role --- admin
router.put(
    "/update-user-role/:id",
    isAuthenticated,
    isAdmin("admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            user.role = req.body.role;
            await user.save();

            res.status(200).json({
                success: true,
                message: "User role updated successfully!",
                user
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// forgot password
router.post(
    "/forgot-password",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const {email} = req.body;
            const user = await User.findOne({email});

            if (!user) {
                return next(new ErrorHandler("User not found with this email", 404));
            }

            // Create a password reset token
            const resetToken = jwt.sign({id: user._id}, process.env.ACTIVATION_SECRET, {
                expiresIn: "30m",
            });

            const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
                    <h2 style="color: #7c3aed; text-align: center;">Reset Your Password</h2>
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password for your DivineSoul account. Please click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetPasswordUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    <p>This link is valid for 30 minutes. If you did not request a password reset, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">DivineSoul</p>
                </div>
            `;

            await sendMail({
                email: user.email,
                subject: "Reset Password | DivineSoul",
                html: emailHtml,
            });

            res.status(200).json({
                success: true,
                message: `Please check your email: ${user.email} to reset your password!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// reset password
router.post(
    "/reset-password",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const {token, password} = req.body;
            const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);

            if (!decoded) {
                return next(new ErrorHandler("Token invalid or expired", 400));
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            user.password = password;
            await user.save();

            res.status(200).json({
                success: true,
                message: "Password reset successful! You can now log in.",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    })
);

module.exports = router;


//
// // update user avatar
// router.put(
//   "/update-avatar",
//   isAuthenticated,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       let existsUser = await User.findById(req.user.id);
//       if (req.body.avatar !== "") {
//         const imageId = existsUser.avatar.public_id;
//
//         await cloudinary.v2.uploader.destroy(imageId);
//
//         const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//           folder: "avatars",
//           width: 150,
//         });
//
//         existsUser.avatar = {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         };
//       }
//
//       await existsUser.save();
//
//       res.status(200).json({
//         success: true,
//         user: existsUser,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );
//
