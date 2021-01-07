const socket_io = require("socket.io");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils.helper");
const GlobalMessage = require("../models/GlobalMessage");
const User = require("../models/User");

const socketTypes = {
  NOTIFICATION: "NOTIFICATION",
  GLOBAL_MSG_INIT: "GLOBAL_MESSAGE_INIT",
  GLOBAL_MSG_SEND: "GLOBAL_MSG_SEND",
  GLOBAL_MSG_RECEIVE: "GLOBAL_MSG_RECEIVE",
  PRIVATE_MSG_INIT: "PRIVATE_MSG_INIT",
  PRIVATE_MSG_SEND: "PRIVATE_MSG_SEND",
  PRIVATE_MSG_RECEIVE: "PRIVATE_MSG_RECEIVE",
  ERROR: "ERROR",
};

const io = socket_io();
const socketApi = {};
socketApi.io = io;

let onlineUsers = {};

io.use((socket, next) => {
  try {
    const tokenString = socket.handshake.query.accessToken;
    console.log(tokenString);
    if (!tokenString)
      return next(
        new AppError(401, "Login required", "SocketIO Connection Error")
      );
    const accessToken = tokenString.replace("Bearer ", "");
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(
            new AppError(401, "Token expired", "SocketIO Connection Error")
          );
        } else {
          return next(
            new AppError(401, "Token is invalid", "SocketIO Connection Error")
          );
        }
      }
      socket.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", async function (socket) {
  console.log("Connected", socket.userId);
  onlineUsers[socket.userId] = socket.id;
  console.log(onlineUsers);

  socket.on(socketTypes.GLOBAL_MSG_INIT, async () => {
    try {
      let globalMessages = await GlobalMessage.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .populate("user");
      globalMessages = globalMessages.reverse();
      io.emit(socketTypes.NOTIFICATION, { globalMessages });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(socketTypes.GLOBAL_MSG_SEND, async (msg) => {
    try {
      const user = await User.findById(msg.from);
      if (user && user._id.equals(socket.userId) && msg.body) {
        const globalMsg = await GlobalMessage.create({
          user: msg.from,
          body: msg.body,
        });
        globalMsg.user = user;
        io.emit(socketTypes.NOTIFICATION, { globalMsg });
      }
    } catch (error) {
      console.log(error);
    }
  });

  io.emit(socketTypes.NOTIFICATION, {
    onlineUsers: Object.keys(onlineUsers),
  });

  socket.on("error", (error) => {
    console.log(error);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected", socket.userId);
    delete onlineUsers[socket.userId];
    io.emit(socketTypes.NOTIFICATION, {
      onlineUsers: Object.keys(onlineUsers),
    });
  });
});

module.exports = socketApi;
