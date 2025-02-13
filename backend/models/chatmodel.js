const mongoose = require("mongoose");

const chatmodel = new mongoose.Schema(
  {
    chatname: {
      type: String,
      trim: true,
    },
    isGroupchat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestmessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isgroupadmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatmodel);

module.exports = Chat;
