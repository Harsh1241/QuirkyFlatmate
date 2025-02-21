const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Fetching leaderboard...");

    const leaders = await User.find()
      .sort({ karmaPoints: -1 }) // ✅ Sort in descending order
      .limit(10)
      .select("username karmaPoints");

    console.log("✅ Leaderboard Data Sent:", leaders); // Debugging
    res.json(leaders);
  } catch (error) {
    console.error("🔴 Error fetching leaderboard:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
