import React from "react";
import { BsFillChatRightDotsFill } from "react-icons/bs";
import { Tooltip } from "antd";

const BarComponent = () => {
  return (
    <section className="flex h-full bg-gray-600 flex-col w-14 justify-between p-2 items-center">
      <div className="flex flex-col mt-3">
        <Tooltip title="Chats" placement="right">
          <div className="group cursor-pointer p-2 rounded-full transition duration-300 hover:bg-gray-500">
            <BsFillChatRightDotsFill size={35} className="text-white" />
          </div>
        </Tooltip>
      </div>

      {/* Avatar with Hover Effect */}
      <Tooltip title="Profile" placement="right">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 relative group cursor-pointer">
          <img
            src="/default-avatar-icon.jpg"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-500 opacity-0 rounded-full transition-opacity duration-300 group-hover:opacity-30"></div>
        </div>
      </Tooltip>
    </section>
  );
};

export default BarComponent;
