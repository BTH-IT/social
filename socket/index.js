const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDatabase = require("./Services/ConnectDBService");

dotenv.config();

connectDatabase();

const ActiveSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    socketId: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const ActiveModel = mongoose.model("Actives", ActiveSchema);

const io = require("socket.io")(process.env.PORT || 5000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // add new user
  socket.on("new-user-add", async (newUserId) => {
    let activeUsers = await ActiveModel.find({});
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      await ActiveModel.create({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    activeUsers = await ActiveModel.find({});

    io.emit("get-users", activeUsers);
  });

  socket.on("get-online-user", async () => {
    const activeUsers = await ActiveModel.find({});

    io.emit("get-users", activeUsers);
  });

  // disconnect socket server
  socket.on("disconnect", async () => {
    await ActiveModel.deleteOne({ socketId: socket.id });
    const activeUsers = await ActiveModel.find({});
    console.log(activeUsers, socket.id);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", async (data) => {
    const activeUsers = await ActiveModel.find({});
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);

    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  socket.on("like-post", async (post, notification) => {
    const activeUsers = await ActiveModel.find({});
    const user = activeUsers.find((user) => user.userId === post.userId);

    if (user && notification !== null) {
      io.to(user.socketId).emit("noti-like-post", notification);
    }

    io.emit("liked-post", post);
  });

  socket.on("save-post", (post) => {
    io.emit("saved-post", post);
  });

  socket.on("add-comment", (post) => {
    io.emit("added-comment", post);
  });

  socket.on("heart-comment", (comment) => {
    io.emit("hearted-comment", comment);
  });
});
