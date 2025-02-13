import React, { useState, useEffect } from "react";
import { Chatstate } from "../Context/Chatprovider";
import Mychats from "../components/Mychats";
import Chatbox from "../components/Chatbox";
import BarComponent from "../components/Bar.componnet";
import { Flex, Spin } from "antd";
import { GetAllUsersRequest, GetMyChatsRequest } from "../requests/request"; // Add FetchUserChats
import { useNavigate } from "react-router-dom";

const Chatpage = () => {
  const { User, loading } = Chatstate();
  const [allUsers, setallUsers] = useState([]);
  const [chats, setChats] = useState([]); // Add chats state
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!User) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [User]);

  // Add useEffect for fetching chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await GetMyChatsRequest();
        setChats(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChats();
  }, []);

  // Update user fetching useEffect (fix infinite loop)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetAllUsersRequest("");
        setallUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []); // Removed allUsers from dependencies

  // In parent component
  const handleChatUpdate = (updatedChat) => {
    // Update selected chat
    setSelectedChat((prev) => ({ ...prev, ...updatedChat }));

    // Update chats list immutably
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === updatedChat._id ? { ...chat, ...updatedChat } : chat
      )
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="h-[100vh] w-full bg-gray-900">
      {User && (
        <Flex horizontal style={{ height: "100%", padding: "10px" }}>
          <BarComponent />
          <Mychats
            setSelectedChat={setSelectedChat}
            chats={chats} // Pass chats to Mychats
            setChats={setChats}
          />
          <Chatbox
            selectedChat={selectedChat}
            allUsers={allUsers}
            onChatUpdated={handleChatUpdate} // Updated handler
          />
        </Flex>
      )}
    </div>
  );
};

export default Chatpage;
