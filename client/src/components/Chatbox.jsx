import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Divider, Drawer, Modal, Input, message, Checkbox, Button } from "antd";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import {
  IoIosInformationCircleOutline,
  IoMdPersonAdd,
  IoIosSend,
} from "react-icons/io";
import { IoPersonRemove } from "react-icons/io5";
import {
  RenameGroupRequest,
  RemoveMemebersRequest,
  AddMemebersRequest,
} from "../requests/request";
import { Chatstate } from "../Context/Chatprovider";
import moment from "moment";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const Chatbox = ({ selectedChat, allUsers, onChatUpdated }) => {
  const [open, setOpen] = useState(false);
  const { User } = Chatstate();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [selectedRemoveUsers, setSelectedRemoveUsers] = useState([]);
  const [selectedAddUsers, setSelectedAddUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const showDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const showRenameModal = () => setRenameModalOpen(true);
  const closeRenameModal = () => setRenameModalOpen(false);
  const showRemoveModal = () => setRemoveModalOpen(true);
  const closeRemoveModal = () => setRemoveModalOpen(false);
  const showAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  useEffect(() => {
    // ✅ Fetch old messages from DB
    if (!selectedChat || !selectedChat._id) return;
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/messages/${selectedChat._id}`,

        { withCredentials: true }
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));

    // ✅ Join chat room
    socket.emit("join chat", selectedChat._id);

    // ✅ Listen for new messages
    socket.on("new message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("new message");
    };
  }, [selectedChat?._id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = { content: newMessage, chatId: selectedChat._id };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/messages`,
        messageData,
        { withCredentials: true }
      );

      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleRenameGroup = async () => {
    if (!newChatName.trim()) {
      message.error("Group name cannot be empty!");
      return;
    }

    try {
      const response = await RenameGroupRequest(selectedChat._id, newChatName);
      if (response.status === 200) {
        message.success("Group name updated successfully!");
        onChatUpdated(response.data); // Update parent state with response data
        setRenameModalOpen(false);
      } else {
        message.error("Failed to rename group.");
      }
    } catch (error) {
      message.error("Error renaming group.");
    }
  };

  const handleRemoveMembers = async () => {
    if (selectedRemoveUsers.length === 0) {
      message.error("Select at least one member to remove!");
      return;
    }

    try {
      const response = await RemoveMemebersRequest(
        selectedChat._id,
        selectedRemoveUsers
      );
      if (response.status === 200) {
        message.success("Members removed successfully!");
        onChatUpdated(response.data); // Update parent state with response data
        setSelectedRemoveUsers([]);
        closeRemoveModal();
      } else {
        message.error("Failed to remove members.");
      }
    } catch (error) {
      message.error("Error removing members.");
    }
  };

  const handleAddMembers = async () => {
    if (selectedAddUsers.length === 0) {
      message.error("Select at least one user to add!");
      return;
    }

    try {
      const response = await AddMemebersRequest(
        selectedChat._id,
        selectedAddUsers
      );
      if (response.status === 200) {
        message.success("Members added successfully!");
        onChatUpdated(response.data); // Update parent state with response data

        setSelectedAddUsers([]);
        closeAddModal();
      } else {
        message.error("Failed to add members.");
      }
    } catch (error) {
      message.error("Error adding members.");
    }
  };

  if (!selectedChat) {
    return (
      <div className="bg-gray-800 flex flex-grow justify-center items-center h-full p-4">
        <p className="text-gray-400">Select a chat to view messages</p>
      </div>
    );
  }

  // Find users who are **not** in the group
  const nonGroupUsers = allUsers.filter(
    (user) => !selectedChat.users.some((member) => member._id === user._id)
  );

  return (
    <div className="bg-gray-800 flex-grow h-full p-4 flex flex-col">
      <div className="flex justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl">
            {selectedChat.chatname}
          </h1>

          {selectedChat.users && Array.isArray(selectedChat.users) ? (
            <div className="flex text-gray-400 gap-1 mt-1">
              {selectedChat.users.map((user) => (
                <span key={user._id}>{user.username},</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No users found.</p>
          )}
        </div>
        <div>
          <IoIosInformationCircleOutline
            size={28}
            className="text-white cursor-pointer hover:text-gray-400 transition"
            onClick={showDrawer}
          />
        </div>
      </div>

      <Divider style={{ borderColor: "white" }} />

      <div className="flex-1 overflow-auto mb-4 p-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender._id === User._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                msg.sender._id === User._id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : "bg-gray-700"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-300 text-right mt-1">
                {moment(msg.createdAt).format("hh:mm A")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message input area */}
      <div className="mt-auto">
        <div className="flex gap-2">
          <Input
            className="flex-grow"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={handleSendMessage}
          />
          <Button
            type="primary"
            onClick={handleSendMessage}
            icon={<IoIosSend className="align-middle" />}
          />
        </div>
      </div>

      <Drawer
        placement="right"
        onClose={closeDrawer}
        open={open}
        title={`${selectedChat.isGroupchat ? "Group Info" : "Contact Info"}`}
      >
        <section className="flex flex-col justify-center items-center gap-2">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 cursor-pointer">
            <img src="/default-avatar-icon.jpg" alt="Group Pic" />
          </div>
          <div className="flex gap-4 items-center">
            <div className="font-semibold text-xl">{selectedChat.chatname}</div>
            {selectedChat.isGroupchat &&
              selectedChat.isgroupadmin._id === User._id && (
                <CiEdit
                  size={25}
                  className="cursor-pointer"
                  onClick={showRenameModal}
                />
              )}
          </div>
          <div className="text-lg text-gray-500">
            {selectedChat.users?.length > 2
              ? `Group - ${selectedChat.users.length} members`
              : ""}
          </div>
          {selectedChat.isGroupchat &&
            selectedChat.isgroupadmin._id === User._id && (
              <div className="flex gap-14">
                <div
                  className="flex justify-center items-center gap-3 cursor-pointer"
                  onClick={showAddModal}
                >
                  <IoMdPersonAdd size={20} />
                  <div>Add Members</div>
                </div>
                <div
                  className="flex justify-center items-center gap-3 cursor-pointer"
                  onClick={showRemoveModal}
                >
                  <IoPersonRemove size={20} />
                  <div>Remove Members</div>
                </div>
              </div>
            )}
        </section>
        <Divider />
        <section className="mt-3">
          <h2 className="text-xl font-semibold my-3">
            {selectedChat.users.length} Members
          </h2>
          <div className="flex flex-col gap-3">
            {selectedChat.users.map((user) => (
              <div
                key={user._id}
                className="flex gap-5 items-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                  <img
                    src="/default-avatar-icon.jpg"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-medium">{user.username}</div>
              </div>
            ))}
          </div>
        </section>
      </Drawer>

      {/* Rename Group Modal */}
      <Modal
        title="Rename Group"
        open={renameModalOpen}
        onCancel={closeRenameModal}
        onOk={handleRenameGroup}
      >
        <Input
          placeholder="Enter new group name"
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
        />
      </Modal>

      {/* Remove Members Modal */}
      <Modal
        title="Remove Members"
        open={removeModalOpen}
        onCancel={closeRemoveModal}
        onOk={handleRemoveMembers}
      >
        {selectedChat.users.map((user) => (
          <Checkbox
            key={user._id}
            onChange={(e) => {
              setSelectedRemoveUsers((prev) =>
                e.target.checked
                  ? [...prev, user._id]
                  : prev.filter((id) => id !== user._id)
              );
            }}
          >
            {user.username}
          </Checkbox>
        ))}
      </Modal>

      {/* Add Members Modal */}
      <Modal
        title="Add Members"
        open={addModalOpen}
        onCancel={closeAddModal}
        onOk={handleAddMembers}
      >
        {nonGroupUsers.map((user) => (
          <Checkbox
            key={user._id}
            onChange={(e) => {
              setSelectedAddUsers((prev) =>
                e.target.checked
                  ? [...prev, user._id]
                  : prev.filter((id) => id !== user._id)
              );
            }}
          >
            {user.username}
          </Checkbox>
        ))}
      </Modal>
    </div>
  );
};

export default Chatbox;
