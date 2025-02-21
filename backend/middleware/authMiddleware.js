const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    console.error("🔴 No token, authorization denied");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // ✅ Extract user data from token
    console.log(`🔹 Authenticated User ID: ${req.user.id}`);
    next();
  } catch (err) {
    console.error("🔴 Token is invalid!");
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
