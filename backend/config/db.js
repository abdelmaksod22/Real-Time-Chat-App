import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/chatApp")
    .then(() => {
      console.log("Connection Is Open!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
