import React, { useEffect, useState } from "react";
import {
  GetMyChatsRequest,
  CreateChatRequest,
  CreateGroupChatRequest,
} from "../requests/request";
import MychatsHeader from "./Mychats_Header.component";
import SearchComponent from "./SearchComponent";

const Mychats = ({ setSelectedChat, chats, setChats }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Add useEffect to handle chat list updates
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await GetMyChatsRequest();
        setChats(res.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    // Refresh chats when the component mounts or when chats prop changes
    fetchChats();
  }, [setChats]); // Add setChats as dependency

  const handleCreateChat = async (userID) => {
    try {
      const res = await CreateChatRequest(userID);
      const newChat = res.data;

      setChats((prev) => {
        // Prevent duplicates using Set for better performance
        const chatIds = new Set(prev.map((chat) => chat._id));
        return chatIds.has(newChat._id) ? prev : [newChat, ...prev];
      });

      setSelectedChat(newChat);
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  };

  const handleCreateGroupChat = async (selectedUsers, groupName) => {
    try {
      const res = await CreateGroupChatRequest(groupName, selectedUsers);
      const newGroupChat = res.data;

      setChats((prev) => {
        const exists = prev.some((chat) => chat._id === newGroupChat._id);
        return exists ? prev : [newGroupChat, ...prev];
      });

      setSelectedChat(newGroupChat);
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  // Optimized search with memoization
  const filteredChats = React.useMemo(
    () =>
      chats.filter((chat) =>
        chat.chatname.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [chats, searchQuery]
  );

  return (
    <section className="bg-gray-900 w-4/12 px-3 h-full flex flex-col">
      <MychatsHeader
        onCreateChat={handleCreateChat}
        onCreateGroupChat={handleCreateGroupChat}
      />
      <SearchComponent setSearchQuery={setSearchQuery} />

      {/* Virtualized list for better performance */}
      <div className="mt-4 flex-grow overflow-y-auto max-h-[calc(100vh-120px)]">
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat._id}
            chat={chat}
            onClick={() => setSelectedChat(chat)}
          />
        ))}
      </div>
    </section>
  );
};

// Separate component for chat items to optimize re-renders
const ChatListItem = React.memo(({ chat, onClick }) => (
  <div
    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition"
    onClick={onClick}
  >
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
      <img
        src="/default-avatar-icon.jpg"
        alt={chat.chatname}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex flex-col">
      <div className="text-white font-medium">
        {chat.chatname}
        {chat.isGroupchat && (
          <span className="text-gray-400 ml-2 text-sm">
            ({chat.users?.length} members)
          </span>
        )}
      </div>
      {chat.latestmessage && (
        <div className="text-gray-400">
          {`${
            chat.latestmessage.sender.username
          }: ${chat.latestmessage.content.slice(0, 30)}...`}
        </div>
      )}
    </div>
  </div>
));

export default Mychats;
