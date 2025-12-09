// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Import Routes
const userRoutes = require("./Routes/userRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes"); // <--- Add this

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("PERN + Prisma server with routes 🚀");
});

// Use Routes
app.use("/users", userRoutes);
app.use("/api", dashboardRoutes); // <--- Add this (Prefix with /api)

module.exports = app;