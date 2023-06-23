const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../Controllers/AuthController");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!verifyToken(req)) {
      return res.status(401).json("Token expired");
    }
    return res.status(200).json("File Uploaded Successfully");
  } catch (error) {
    return res.status(404).json("File Uploaded Failure");
  }
});

router.delete("/:filename", (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const { filename } = req.params;

  try {
    fs.unlinkSync("public/files/" + filename);
    return res.status(200).send("Successfully! Image has been Deleted");
  } catch (err) {
    // handle the error
    return res.status(400).send(err);
  }
});

module.exports = router;
