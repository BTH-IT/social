const express = require("express");
const {
  getUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  followUser,
  unFollowUser,
  getAllUser,
} = require("../Controllers/UserController");

const router = express.Router();

router.get("/:id", getUser);
router.get("/username/:username", getUserByUsername);
router.get("/", getAllUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/follow/:id", followUser);
router.put("/unfollow/:id", unFollowUser);

module.exports = router;
