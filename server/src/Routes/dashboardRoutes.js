const express = require("express");
const { getDashboardData, createPost, toggleLike, joinCommunity } = require("../Controllers/dashboardController");

const router = express.Router();

router.get("/dashboard/:userId", getDashboardData);

// New Actions
router.post("/post/create", createPost);
router.post("/post/like", toggleLike);
router.post("/community/join", joinCommunity);

module.exports = router;