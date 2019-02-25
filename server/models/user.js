import mongoose from "mongoose";
import validator from "validator";

const User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valide email"
    }
  },
  password: {
    type: String,
    require: true,
    minLength: 7
  },
  tokens: [
    {
      access: {
        type: String,
        require: true
      },
      token: {
        type: String,
        require: true
      }
    }
  ]
});
export { User };
