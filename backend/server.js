const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const login = require("./controllers/login");
const signup = require("./controllers/signin");
const forgotPass = require("./controllers/forgetpassword");
const resetPass = require("./controllers/resetpassword");
const users = require("./controllers/allusers");
const checkAuth = require("./services/checkauth");
const chat = require("./controllers/chatroutes");
const currentUser = require("./controllers/currentuser");
const messages = require("./controllers/messages.controller");
const logout = require("./controllers/logout");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Replace with your front-end URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

mongoose
  .connect(process.env.MONGO_DB, {})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error(`MongoDB connection error: ${error}`));

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

// Socket.io Configuration
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 📌 Join chat room
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // 📌 Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// API Routes
app.use("/users", checkAuth, users);
app.use("/chat", checkAuth, chat);
app.use("/messages", checkAuth, messages(io));
app.use("/currentuser", checkAuth, currentUser);
app.use("/signup", signup);
app.use("/login", login);
app.use("/forgot-password", forgotPass);
app.use("/reset-password", resetPass);
app.use("/logout", logout);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
