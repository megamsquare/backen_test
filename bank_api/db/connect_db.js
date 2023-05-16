import mongoose from "mongoose";
import model from "../models/index.js";

// const Role = model.role;

async function connect_db(url) {
     try {
          await mongoose.connect(url);
          console.log("Successfully connect to MongoDB.");
     } catch (error) {
          console.error(`MongoDB connection error: ${error}`);
     }
}

export default connect_db;