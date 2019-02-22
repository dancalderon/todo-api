import mongoose from "mongoose";
const User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1
  }
});
export { User };
