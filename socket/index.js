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
  socket.on("connected", async (newUserId) => {
    console.log(newUserId);
    console.log(socket.id);
    let activeUsers = await ActiveModel.find({});
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      await ActiveModel.create({
        userId: newUserId,
        socketId: socket.id,
      });
      console.log("connect");
    } else {
      await ActiveModel.updateOne(
        {
          userId: newUserId,
        },
        {
          socketId: socket.id,
        }
      );
      console.log("re-connect");
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
    console.log("disconnect");
    await ActiveModel.deleteOne({ socketId: socket.id });
    const activeUsers = await ActiveModel.find({});
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
      io.to(user.socketId).emit("noti", notification);
    }
    io.emit("liked-post", post);
  });

  socket.on("add-comment", async (post, notification) => {
    const activeUsers = await ActiveModel.find({});
    const user = activeUsers.find((user) => user.userId === post.userId);

    if (user && notification !== null) {
      io.to(user.socketId).emit("noti", notification);
    }

    io.emit("added-comment", post);
  });

  socket.on("heart-comment", async (post, notification) => {
    const activeUsers = await ActiveModel.find({});
    const user = activeUsers.find((user) => user.userId === post.userId);

    if (user && notification !== null) {
      io.to(user.socketId).emit("noti", notification);
    }

    io.emit("hearted-comment", post);
  });
});
