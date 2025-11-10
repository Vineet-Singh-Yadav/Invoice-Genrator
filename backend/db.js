import mongoose from "mongoose";

export default function connectDB (){
  mongoose.connect("mongodb://localhost:27017/invoiceGenrator")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}