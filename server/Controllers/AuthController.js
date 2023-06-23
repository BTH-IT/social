const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StoryModel = require("../Models/StoryModel");
const NotificationModel = require("../Models/NotificationModel");

async function registerUser(req, res) {
  const { username, password, fullname, email } = req.body;

  const hashedPass = bcrypt.hashSync(password, 10);

  try {
    const { _doc: newUser } = await UserModel.create({
      username,
      password: hashedPass,
      fullname,
      email,
      profilePicture: "",
    });

    await StoryModel.create({ userId: newUser._id });
    await NotificationModel.create({ userId: newUser._id });

    res.status(200).json("Register successful with id: " + newUser._id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function verifyToken(req) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return false;
  const accessToken = bearerHeader.split(" ")[1];

  try {
    const decodeJwt = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (decodeJwt) {
      return true;
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return false;
    }
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      const validity = bcrypt.compareSync(password, user.password);

      if (validity) {
        const { password, ...otherDetails } = user._doc;

        const jwtToken = jwt.sign(
          {
            otherDetails,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ jwtToken, otherDetails });
      } else {
        res.status(400).json("Wrong Password");
      }
    } else {
      res.status(404).json("User does not exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { registerUser, loginUser, verifyToken };
