const express = require("express");
const router = express.Router();
const { deleteFile, uploadFile } = require("../Controllers/UploadController");
const { uploadCloud } = require("../cloudinary.config");

router.post("/", uploadCloud.array("file"), uploadFile);
// router.post("/video", multer.single("file"), uploadFileVideo);
router.delete("/:filename", deleteFile);

module.exports = router;
