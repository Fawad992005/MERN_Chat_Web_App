const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Chat = require("../models/chatmodel");

module.exports = (io) => {
  // ✅ Get All Messages for a Chat
  router.get("/:chatId", async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "username pic email")
        .sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // ✅ Send a Message
  router.post("/", async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res
        .status(400)
        .json({ message: "Missing message content or chatId" });
    }

    try {
      let message = await Message.create({
        sender: req.user.id,
        content,
        chat: chatId,
      });

      // Update latest message in the chat
      await Chat.findByIdAndUpdate(chatId, { latestmessage: message._id });

      message = await message.populate("sender", "username pic email");
      message = await message.populate({
        path: "chat",
        populate: { path: "users", select: "username email pic" },
      });

      // 🔥 Emit the new message to the chat room
      io.to(chatId).emit("new message", message);

      res.status(200).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  return router;
};
