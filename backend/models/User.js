const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true,default:true}, // ✅ Ensure name exists
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  flatCode: { type: String, required: true },
  karmaPoints: { type: Number, default: 0 } // ✅ Ensure karmaPoints exists
});

module.exports = mongoose.model("User", UserSchema);
