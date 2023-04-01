import mongoose from "mongoose";
import model from "../models/index.js";

const Role = model.role;

function connect_db(url) {
     return mongoose.connect(url)
          .then(() => {
               console.log("Successfully connect to MongoDB.");
          })
          .catch((error) => {
               console.error(`MongoDB connection error: ${error}`);
          });
}

export default connect_db;