const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Starting MongoDB connection...");
    
    const uri = process.env.MONGO_URI || "";
    if (!uri) {
        console.error("MongoDB connection failed: MONGO_URI is not defined in environment variables.");
        process.exit(1);
    }
    
    // Ensure "tasto" is used as the database name if connecting to Atlas
    // (A more robust way is to just let mongoose connect to the URI)
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
