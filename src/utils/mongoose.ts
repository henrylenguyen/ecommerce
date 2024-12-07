"use server";
import mongoose from "mongoose";

// singleton connection
let isConnected: boolean = false;

export const connectToDatabase = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined");
  }
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      
      dbName: "udemy", // là tên database cần kết nối
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log("error connecting to MongoDB", error);
  }
};
