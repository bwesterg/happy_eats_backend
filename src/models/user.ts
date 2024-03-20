import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0Id: {
    // Only auth0 name and email are required for initial google registration
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String
  },
});

const User = mongoose.model("User", userSchema);
export default User;