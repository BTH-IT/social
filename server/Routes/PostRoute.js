const express = require("express");
const {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePosts,
  getTimelineYourPosts,
  getAll,
  commentPost,
  likeCommentPost,
  savePost,
  getSavePost,
} = require("../Controllers/PostController");

const router = express.Router();

router.post("/", createPost);
router.get("/", getAll);
router.get("/:id", getPost);
router.get("/saved/:id", getSavePost);
router.put("/:id", updatePost);
router.delete("/:userId/:postId", deletePost);
router.put("/like/:id", likePost);
router.put("/saved/:id", savePost);
router.put("/comment/:id", commentPost);
router.put("/comment/like/:id", likeCommentPost);
router.get("/timeline/:id", getTimelinePosts);
router.get("/your-timeline/:id", getTimelineYourPosts);

module.exports = router;
