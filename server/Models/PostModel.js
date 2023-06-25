const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    desc: String,
    saved: [],
    likes: [],
    comments: [],
    fileUploads: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    feeling: {
      type: String,
    },
    tagUser: [],
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Posts", PostSchema);

module.exports = PostModel;
