const { verifyToken } = require("../Controllers/AuthController");
const { cloudinary } = require("../cloudinary.config");

async function uploadFile(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }

  const fileCloudinary = req.files.map((file) => {
    return {
      id: file.filename,
      url: file.path,
      type: file.mimetype.split("/")[0],
    };
  });

  try {
    res.status(200).json(fileCloudinary);
  } catch (error) {
    res.status(400).json("đã có lỗi");
  }
}

async function deleteFile(req, res) {
  if (!verifyToken(req)) {
    return res.status(401).json("Token expired");
  }
  const { filename } = req.params;

  try {
    await cloudinary.uploader.destroy(filename);

    res.status(200).json("delete successfull");
  } catch (error) {
    res.status(400).json("delete successfull");
  }
}

module.exports = { uploadFile, deleteFile };
