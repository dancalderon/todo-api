import mongoose from "mongoose";
const env = process.env.NODE_ENV || "development";

console.log("env  *******", env);
if (env === "development") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === "test") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log("Connect to Database"))
  .catch(err => console.log("Not connected to Database ERROR ", err));

export { mongoose };
console.log("/*/*/*/*/*/*/*/*", process.env.NODE_ENV);
