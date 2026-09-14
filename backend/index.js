const app = require("./app");
const connectDatabase = require("./Db/Database");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
});

// config
require("dotenv").config();

// connect db
connectDatabase();

// Only listen locally (in serverless Vercel, app is exported)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const server = app.listen(process.env.PORT || 4000, () => {
        console.log(
            `Server is running on http://localhost:${process.env.PORT || 4000}`
        );
    });

    process.on("unhandledRejection", (err) => {
        console.log(`Shutting down the server for ${err.message}`);
        server.close(() => {
            process.exit(1);
        });
    });
}

module.exports = app;
