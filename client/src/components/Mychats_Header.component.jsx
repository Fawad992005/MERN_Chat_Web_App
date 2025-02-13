import React, { useState, useEffect } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { BiMessageAdd } from "react-icons/bi";
import {
  Tooltip,
  Dropdown,
  Drawer,
  Divider,
  Button,
  Input,
  Avatar,
  List,
} from "antd";
import { LogOutRequest, GetAllUsersRequest } from "../requests/request";
import { Chatstate } from "../Context/Chatprovider";
import { useNavigate } from "react-router-dom";
import SearchComponent from "./SearchComponent";

const MychatsHeader = ({ onCreateChat, onCreateGroupChat }) => {
  const { setUser } = Chatstate();
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (!openDrawer) {
      setSearchQuery("");
    }
  }, [openDrawer]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!openDrawer && !openGroupDrawer) return;
      try {
        const response = await GetAllUsersRequest(debouncedSearchQuery);
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [debouncedSearchQuery, openDrawer, openGroupDrawer]);

  const handleLogout = async () => {
    try {
      await LogOutRequest();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };
  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.some((u) => u._id === user._id)) {
        return prevSelectedUsers.filter((u) => u._id !== user._id);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    await onCreateGroupChat(selectedUsers, groupName);
    setOpenGroupDrawer(false);
    setChildrenDrawer(false);
    setSelectedUsers([]);
    setGroupName("");
  };

  const items = [
    {
      label: (
        <button onClick={() => setOpenGroupDrawer(true)}>New Group</button>
      ),
      key: "0",
    },
    { label: <button onClick={handleLogout}>Logout</button>, key: "1" },
  ];

  return (
    <div>
      <div className="flex justify-between py-3">
        <h1 className="text-white font-bold text-xl">Chats</h1>
        <div className="flex gap-4">
          <Tooltip title="New Chat">
            <div
              className="cursor-pointer p-2 rounded-full hover:bg-gray-700"
              onClick={() => setOpenDrawer(true)}
            >
              <BiMessageAdd size={25} color="white" />
            </div>
          </Tooltip>

          <Dropdown menu={{ items }} trigger={["click"]}>
            <Tooltip title="Menu">
              <div className="cursor-pointer p-2 rounded-full hover:bg-gray-700">
                <AiOutlineMore size={25} color="white" />
              </div>
            </Tooltip>
          </Dropdown>
        </div>
      </div>

      <Drawer
        title="Start a New Chat"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        closable={true}
        open={openDrawer}
      >
        <SearchComponent setSearchQuery={setSearchQuery} />
        <Divider />
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              key={user._id}
              onClick={() => onCreateChat(user._id)}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            >
              <List.Item.Meta
                avatar={
                  <Avatar src={user.avatar || "/default-avatar-icon.jpg"} />
                }
                title={user.username}
              />
            </List.Item>
          )}
        />
      </Drawer>

      <Drawer
        title="Select Members for Group"
        placement="left"
        onClose={() => setOpenGroupDrawer(false)}
        open={openGroupDrawer}
      >
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              key={user._id}
              onClick={() => handleUserSelection(user)}
              className={`cursor-pointer p-2 rounded-md ${
                selectedUsers.some((u) => u._id === user._id)
                  ? "bg-blue-300"
                  : "hover:bg-gray-200"
              }`}
            >
              <List.Item.Meta
                avatar={
                  <Avatar src={user.avatar || "/default-avatar-icon.jpg"} />
                }
                title={user.username}
              />
            </List.Item>
          )}
        />
        <Button
          type="primary"
          onClick={showChildrenDrawer}
          disabled={selectedUsers.length === 0}
          block
        >
          Next
        </Button>
      </Drawer>

      <Drawer
        title="Create Group"
        width={320}
        placement="left"
        onClose={onChildrenDrawerClose}
        open={childrenDrawer}
      >
        <Input
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <Divider />
        <Button
          type="primary"
          onClick={handleCreateGroup}
          disabled={!groupName.trim()}
          block
        >
          Create Group
        </Button>
      </Drawer>
    </div>
  );
};

export default MychatsHeader;
