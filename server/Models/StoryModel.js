const mongoose = require("mongoose");

const StorySchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    stories: [],
  },
  { timestamps: true }
);

const StoryModel = mongoose.model("Stories", StorySchema);

module.exports = StoryModel;
