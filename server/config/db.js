import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri && uri !== "mongodb://127.0.0.1:27017/khatabook") {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`MongoDB Connected (Atlas/Custom): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB Atlas Connection Error: ${error.message}`);
    }
  }

  // Try local MongoDB first
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/khatabook", { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
    return;
  } catch (err) {
    console.log("Local MongoDB not detected. Starting in-memory MongoDB fallback server...");
  }

  // Fallback to mongodb-memory-server if local/custom connection fails
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Failed to start MongoMemoryServer: ${error.message}`);
  }
};

export default connectDB;
