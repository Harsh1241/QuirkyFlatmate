const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  const { name, email, password, flatCode } = req.body;
  
  try {
    console.log("🔹 Registering user:", req.body);

    // ✅ Check if user exists by email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // ✅ Create new user
    user = new User({ name, email, password, flatCode });

    // ✅ Hash Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    console.log("✅ User registered successfully:", user);

    // ✅ Generate JWT Token
    const payload = { user: { id: user.id, email: user.email, flatCode: user.flatCode } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    console.error("🔴 Registration Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔹 Login attempt:", email);

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    console.log("✅ Login successful:", user.email);

    // ✅ Generate JWT Token
    const payload = { user: { id: user.id, email: user.email, flatCode: user.flatCode } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    console.error("🔴 Login Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { register, login };
