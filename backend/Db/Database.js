const mongoose = require("mongoose");

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const data = await mongoose.connect(process.env.DB_URL);
    isConnected = true;
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
  }
};

module.exports = connectDatabase;

