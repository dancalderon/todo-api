import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true });

export { mongoose };
