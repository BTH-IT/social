const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    desc: String,
    followers: [],
    followings: [],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
