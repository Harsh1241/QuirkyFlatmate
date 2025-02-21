const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  severity: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flatCode: { type: String, required: true },
  upvotes: { type: Number, default: 0 }, // ✅ Ensure default value
  downvotes: { type: Number, default: 0 }, // ✅ Ensure default value
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
