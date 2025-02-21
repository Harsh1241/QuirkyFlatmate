const User = require('../models/User');
const Complaint = require('../models/Complaint');

// Get leaderboard (ranked by karma points)
const getLeaderboard = async (req, res) => {
  try {
    console.log("🔹 Fetching leaderboard...");
  
    // ✅ Fetch users sorted by karmaPoints in descending order
    const users = await User.find({})
      .select("name karmaPoints") // ✅ Only fetch name & karma points
      .sort({ karmaPoints: -1 });

    console.log("✅ Leaderboard Data:", users);
    res.json(users);
  } catch (err) {
    console.error("🔴 Error fetching leaderboard:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// Get flat statistics (e.g., top complaint categories)
const getFlatStats = async (req, res) => {
  try {
    const complaints = await Complaint.find({ flatCode: req.user.flatCode });

    // Calculate top complaint categories
    const categoryCounts = complaints.reduce((acc, complaint) => {
      acc[complaint.type] = (acc[complaint.type] || 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));

    res.json({ topCategories });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getLeaderboard,
  getFlatStats,
};