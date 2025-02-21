const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging

    await mongoose.connect(process.env.MONGODB_URI); // No need for options in Mongoose 6+

    console.log('MongoDB Connected');
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
