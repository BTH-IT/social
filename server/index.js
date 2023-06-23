const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDatabase = require("./Services/ConnectDBService");
const AuthRoute = require("./Routes/AuthRoute");
const UserRoute = require("./Routes/UserRoute");
const PostRoute = require("./Routes/PostRoute");
const UploadRoute = require("./Routes/UploadRoute");
const StoryRoute = require("./Routes/StoryRoute");
const ChatRoute = require("./Routes/ChatRoute");
const MessageRoute = require("./Routes/MessageRoute");
const NotificationRoute = require("./Routes/NotificationRoute");

const app = express();

// tp serve files for public
app.use(express.static("public"));
app.use("/files", express.static("files"));

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(
  cors({
    origin: "*", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

// env
dotenv.config();

// connect mongose
connectDatabase();

// Routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/upload", UploadRoute);
app.use("/story", StoryRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/notification", NotificationRoute);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening PORT: ${process.env.PORT}`)
);
