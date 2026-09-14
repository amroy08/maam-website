const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../Model/user");
const Shop = require("../Model/shop");


exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(`Token is: ${token}`);

    if (!token) {
        return res.status(401).json({ message: "Please login to continue" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the user exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        // Handle JWT errors
        if (error.name === "JsonWebTokenError") {
            return res
                .status(401)
                .json({ message: "Invalid token, please login again" });
        } else if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ message: "Token has expired, please login again" });
        }

        // Handle other errors
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


exports.isShop = catchAsyncErrors(async (req, res, next) => {
    const { shopToken } = req.cookies;
    // console.log(`Token is: ${token}`);

    if (!shopToken) {
        return res.status(401).json({ message: "Please login to continue" });
    }

    try {
        const decoded = jwt.verify(shopToken, process.env.JWT_SECRET_KEY);

        // Check if the user exists
        const shop = await Shop.findById(decoded.id);
        if (!shop) {
            return res.status(404).json({ message: "User not found" });
        }

        req.shop = shop;
        next();
    } catch (error) {
        // Handle JWT errors
        if (error.name === "JsonWebTokenError") {
            return res
                .status(401)
                .json({ message: "Invalid token, please login again" });
        } else if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ message: "Token has expired, please login again" });
        }

        // Handle other errors
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


exports.isAdmin = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} can not access this resources!`))
        }
        next();
    }
}