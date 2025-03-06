import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    avatarUrl: {
      type: String,
      required: true,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userSchema);
export default User;