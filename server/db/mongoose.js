import mongoose from "mongoose";
//mongoose.connect will return a promise, in order to avoid bugs
//just add a thenc and handle the res
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp", {
    useNewUrlParser: true
  })
  .then(() => console.log("Connect to Database"))
  .catch(err => console.log("Not connected to Database ERROR ", err));

export { mongoose };
