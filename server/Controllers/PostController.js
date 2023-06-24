const mongoose = require("mongoose");
const PostModel = require("../Models/PostModel");
const UserModel = require("../Models/UserModel");
const { verifyToken } = require("./AuthController");

async function createPost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json("Post created");
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getPost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const postId = req.params.id;

  try {
    const post = await PostModel.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function updatePost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);

    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Update successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function deletePost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const post = await PostModel.findById(postId);

    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Delete successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function commentPost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }

  const postId = req.params.id;

  try {
    const post = await PostModel.findById(postId);

    if (req.body.parentId === "undefined") {
      req.body.parentId = null;
    }

    await post.updateOne({
      $push: {
        comments: {
          id: new mongoose.Types.ObjectId(),
          username: req.body.username,
          content: req.body.content,
          parentId: req.body.parentId,
          userId: req.body.userId,
          likes: [],
          createdAt: new Date(),
          updateAt: new Date(),
        },
      },
    });

    const newPost = await PostModel.findById(postId);
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function likeCommentPost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const postId = req.params.id;
  const { userId, commentId } = req.body;

  try {
    const post = await PostModel.findById(postId);

    const commentIndex = post.comments.findIndex((comment) => {
      return comment.id.toString() === commentId;
    });

    if (commentIndex === -1) return res.status(404).json("Not found");

    if (!post.comments[commentIndex].likes.includes(userId)) {
      post.comments[commentIndex].likes.push(userId);
    } else {
      const userDelete = post.comments[commentIndex].likes.findIndex(
        (id) => id === userId
      );
      post.comments[commentIndex].likes.splice(userDelete, 1);
    }

    await post.updateOne({
      $set: {
        comments: post.comments,
      },
    });

    const newPost = await PostModel.findById(postId);

    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function likePost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);

    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unliked");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getTimelineYourPosts(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    res.status(200).json([...currentUserPosts]);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getTimelinePosts(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "followings",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(currentUserPosts.concat(...followingPosts[0].followingPosts));
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getAll(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }

  try {
    const postList = await PostModel.find({});

    res.status(200).json(postList);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function savePost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }

  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);

    if (!post.saved.includes(userId)) {
      await post.updateOne({ $push: { saved: userId } });
      res.status(200).json("Post saved");
    } else {
      await post.updateOne({ $pull: { saved: userId } });
      res.status(200).json("Post unsaved");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function getSavePost(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }

  const userId = req.params.id;

  try {
    const postList = await PostModel.find({});

    const savePost = postList.filter((post) => post.saved.includes(userId));

    res.status(200).json(savePost);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
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
};
