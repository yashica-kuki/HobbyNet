const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./Routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("PERN + Prisma server with routes 🚀");
});

// Centralized routes
app.use("/users", userRoutes);

module.exports=app;