const express = require("express");
const router = express.Router();
const Chat = require("../models/chatmodel");
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    return res.status(400).json({ message: "userID not provided" });
  }

  let isChat = await Chat.find({
    isGroupchat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userID } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestmessage");

  isChat = await User.populate(isChat, {
    path: "latestmessage.sender",
    select: "username pic email",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
  }

  try {
    // Fetch the user details to set the chatname
    const otherUser = await User.findById(userID).select("username");
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    var chatdata = {
      chatname: otherUser.username, // Set chat name to the other user's name
      isGroupchat: false,
      users: [req.user.id, userID],
    };

    const createdchat = await Chat.create(chatdata);
    const Fullchat = await Chat.findOne({ _id: createdchat._id }).populate(
      "users",
      "-password"
    );

    res.status(200).send(Fullchat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let fetchchat = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("isgroupadmin", "-password")
      .populate("latestmessage")
      .sort({ updatedAt: -1 });
    fetchchat = await User.populate(fetchchat, {
      path: "latestmessage.sender",
      select: "username pic email",
    });
    fetchchat = fetchchat.map((chat) => {
      if (!chat.isGroupchat) {
        // Find the other user in the chat
        const otherUser = chat.users.find(
          (user) => user._id.toString() !== req.user.id
        );
        chat.chatname = otherUser ? otherUser.username : "Unknown";
      }
      return chat;
    });

    res.status(200).send(fetchchat);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error Fectching chats" });
  }
});

router.get("/group", async (req, res) => {
  try {
    const groupChats = await Chat.find({
      isGroupchat: true,
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("isgroupadmin", "-password")
      .sort({ updatedAt: -1 });
    res.status(200).send(groupChats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group chats" });
  }
});

router.post("/group", async (req, res) => {
  var { name, users } = req.body;
  if (!name || !users) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users are required to form a group chat" });
  }
  users.push(req.user.id);

  try {
    const groupchat = await Chat.create({
      chatname: name,
      isGroupchat: true,
      users: users,
      isgroupadmin: req.user.id,
    });

    const fullgroupchat = await Chat.findOne({
      _id: groupchat._id,
    })
      .populate("users", "-password")
      .populate("isgroupadmin", "-password");

    return res.status(201).send(fullgroupchat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
router.put("/renamegroup", async (req, res) => {
  const { chatId, newchatname } = req.body;
  const updatedname = await Chat.findByIdAndUpdate(
    chatId,
    { chatname: newchatname },
    { new: true }
  )
    .populate("users", "-password")
    .populate("isgroupadmin", "-passowrd");

  if (!updatedname) {
    return res.status(400).send({ message: "Chat not found" });
  } else {
    return res.status(200).send(updatedname);
  }
});
router.put("/removefromgroup", async (req, res) => {
  const { chatId, userIds } = req.body; // Expecting an array of userIds

  try {
    const updatechat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: { $in: userIds } } }, // Remove multiple users
      { new: true }
    )
      .populate("users", "-password")
      .populate("isgroupadmin", "-password");

    res.status(200).send(updatechat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/addtogroup", async (req, res) => {
  const { chatId, userIds } = req.body; // Expecting an array of userIds

  try {
    const updatechat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: { $each: userIds } } }, // Add multiple users
      { new: true }
    )
      .populate("users", "-password")
      .populate("isgroupadmin", "-password");

    res.status(200).send(updatechat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
