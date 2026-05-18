import mongoose from 'mongoose';

// Connect to MongoDB using the URI from environment variables
const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('[db] MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[db] MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
