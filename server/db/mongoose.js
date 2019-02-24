import mongoose from "mongoose";
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/YourDB", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connect to Database");
  })
  .catch(err => {
    console.log("Not connected to Database ERROR ", err);
  });

export { mongoose };
