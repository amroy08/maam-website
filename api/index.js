const express = require("express");
const app = require("./backend/app");
const connectDatabase = require("./backend/Db/Database");

require("dotenv").config();

// Connect DB (cached connection in serverless)
connectDatabase();

module.exports = app;
