const express = require("express");
const ErrorHandler = require("./Middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDatabase = require("./Db/Database");

// Ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (err) {
        next(err);
    }
});

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Page</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background: linear-gradient(to right, #6a11cb, #2575fc);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    color: white;
                    text-align: center;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    max-width: 400px;
                }
                h1 {
                    font-size: 2rem;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 1.2rem;
                    margin-top: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1> 🚀 Test Successful !!! </h1>
                <p>Enjoy your Day.. ~ Artisan MarketPlace</p>
                <p>Thanks for testing our Backend..</p>
            </div>
        </body>
        </html>
    `);
});

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}));

// config
require("dotenv").config();

app.use(cors({
    origin: function(origin, callback) {
        callback(null, true);
    },
    credentials: true
}));

// import routes
const user = require("./Controller/user");
const shop = require("./Controller/shop");
const product = require("./Controller/product");
const event = require("./Controller/event");
const coupon = require("./Controller/couponCode");
const payment = require("./Controller/payment");
const order = require("./Controller/order");
const conversation = require("./Controller/conversation");
const message = require("./Controller/message");
const withdraw = require("./Controller/withdraw");
const category = require("./Controller/category");
const heroSlide = require("./Controller/heroSlide");
//
app.use("/user", user);
app.use("/shop", shop);
app.use("/product", product);
app.use("/event", event);
app.use("/coupon", coupon);
app.use("/payment", payment);
app.use("/order", order);
app.use("/conversation", conversation);
app.use("/message", message);
app.use("/withdraw", withdraw);
app.use("/category", category);
app.use("/hero-slide", heroSlide);


// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
