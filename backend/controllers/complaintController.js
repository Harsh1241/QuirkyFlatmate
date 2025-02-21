const Complaint = require('../models/Complaint');
const User = require('../models/User');

// ✅ File a new complaint
const fileComplaint = async (req, res) => {
  try {
    console.log("🔹 Received Complaint Data:", req.body);
    console.log("🔹 User ID from Token:", req.user.id);

    const { title, description, type, severity } = req.body;

    // ✅ Fetch user details to get `flatCode`
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("🔴 User not found!");
      return res.status(404).json({ msg: "User not found" });
    }

    // ✅ Ensure `createdBy` is stored in every new complaint
    const newComplaint = new Complaint({
      title,
      description,
      type,
      severity,
      createdBy: req.user.id, // ✅ Fix: Always store `createdBy`
      flatCode: user.flatCode,
    });

    await newComplaint.save();
    console.log("✅ Complaint Saved Successfully:", newComplaint);

    res.status(201).json(newComplaint);
  } catch (err) {
    console.error("🔴 Error filing complaint:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get all complaints for the logged-in user's flat
const getComplaints = async (req, res) => {
  try {
    console.log("🔹 Fetching complaints for User ID:", req.user.id);

    // Fetch user to get `flatCode`
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("🔴 User not found!");
      return res.status(404).json({ msg: "User not found" });
    }

    // Fetch complaints for the user's flat
    const complaints = await Complaint.find({ flatCode: user.flatCode }).sort({ timestamp: -1 });
    
    console.log("✅ Complaints Sent to Frontend:", complaints); // Debugging
    res.json(complaints);
  } catch (err) {
    console.error("🔴 Error fetching complaints:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}; 


// ✅ Upvote or downvote a complaint
const voteComplaint = async (req, res) => {
  try {
    console.log("🔹 Voting on Complaint ID:", req.params.id, "Type:", req.body.type);

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    // ✅ Ensure upvotes/downvotes exist
    if (complaint.upvotes === undefined) complaint.upvotes = 0;
    if (complaint.downvotes === undefined) complaint.downvotes = 0;

    if (req.body.type === "upvote") {
      complaint.upvotes += 1;
    } else if (req.body.type === "downvote") {
      complaint.downvotes += 1;
    }

    await complaint.save();
    console.log("✅ Updated Votes:", complaint.upvotes, complaint.downvotes);

    res.json(complaint); // ✅ Return updated complaint
  } catch (err) {
    console.error("🔴 Error in voteComplaint:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// ✅ Mark a complaint as resolved
const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔹 Resolving Complaint ID: ${id}`);

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    complaint.resolved = true;
    await complaint.save();

    // ✅ Award karma points to the user who resolved the complaint
    const user = await User.findById(req.user.id);
    if (user) {
      user.karmaPoints += 10; // Example: 10 points per resolved complaint
      await user.save();
    }

    res.json(complaint);
  } catch (err) {
    console.error("🔴 Error resolving complaint:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Generate a punishment for complaints with 10+ upvotes
const generatePunishment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔹 Generating punishment for Complaint ID: ${id}`);

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    if (complaint.upvotes >= 10) {
      const punishments = {
        Noise: "You owe everyone samosas for blasting loud music at 2 AM!",
        Cleanliness: "You’re making chai for everyone for a week for not cleaning the dishes!",
        Bills: "You’re paying the next month’s internet bill!",
        Pets: "You’re cleaning the litter box for a month!",
        Other: "You’re on dish duty for the next two weeks!",
      };

      const punishment = punishments[complaint.type] || "You owe everyone a treat!";
      res.json({ punishment });
    } else {
      res.json({ msg: "This complaint does not qualify for a punishment yet." });
    }
  } catch (err) {
    console.error("🔴 Error generating punishment:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  fileComplaint,
  getComplaints,
  voteComplaint,
  resolveComplaint,
  generatePunishment,
};
