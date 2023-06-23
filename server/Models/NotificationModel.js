const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    notifications: [],
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notifications", NotificationSchema);

module.exports = NotificationModel;
