const express = require("express");
const connectDB = require("./config");
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
require("dotenv").config();
const cors = require("cors");
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;
