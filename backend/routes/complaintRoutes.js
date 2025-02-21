const express = require("express");
const {
  fileComplaint,
  getComplaints,
  voteComplaint,
  resolveComplaint,
  generatePunishment,
} = require("../controllers/complaintController");
const authMiddleware = require("../middleware/authMiddleware");
const Complaint = require("../models/Complaint"); // ✅ Import Complaint model

const router = express.Router();

// ✅ File a new complaint (requires authentication)
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    console.log("🔹 Complaint Request Body:", req.body);
    await fileComplaint(req, res);
  } catch (error) {
    console.error("🔴 Error in fileComplaint:", error.message);
    next(error);
  }
});

// ✅ Get all complaints (requires authentication)
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    await getComplaints(req, res);
  } catch (error) {
    console.error("🔴 Error in getComplaints:", error.message);
    next(error);
  }
});

// ✅ Vote for a complaint (requires authentication)
router.post("/:id/vote", authMiddleware, async (req, res) => {
  try {
    console.log("Received vote request:", req.body);
    console.log("Params:", req.params);

    const { type } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      console.error("🔴 Complaint not found in database!");
      return res.status(404).json({ msg: "Complaint not found" });
    }

    console.log("🔹 Complaint Found:", complaint);

    if (type === "upvote") complaint.upvotes += 1;
    if (type === "downvote") complaint.downvotes += 1;

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    console.error("🔴 Server Error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});


// ✅ Resolve a complaint (requires authentication)
router.put("/:id/resolve", authMiddleware, async (req, res, next) => {
  try {
    await resolveComplaint(req, res);
  } catch (error) {
    console.error("🔴 Error in resolveComplaint:", error.message);
    next(error);
  }
});

// ✅ Generate punishment for a complaint (requires authentication)
router.get("/:id/punishment", authMiddleware, async (req, res, next) => {
  try {
    await generatePunishment(req, res);
  } catch (error) {
    console.error("🔴 Error in generatePunishment:", error.message);
    next(error);
  }
});

// ✅ Global error handler
router.use((err, req, res, next) => {
  console.error("🚨 Unhandled Error:", err);
  res.status(500).json({ msg: "Server error", error: err.message });
});

module.exports = router;
