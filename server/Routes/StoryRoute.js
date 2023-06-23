const express = require("express");

const router = express.Router();

const {
  createStory,
  getStory,
  updateStory,
  deleteStory,
  getTimelineStories,
  updateExpiredStories,
  getStoryByUserId,
} = require("../Controllers/StoryController");

router.post("/", createStory);
router.get("/:id", getStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);
router.get("/timeline/:id", getTimelineStories);
router.get("/", updateExpiredStories);
router.get("/user-id/:userId", getStoryByUserId);

module.exports = router;
