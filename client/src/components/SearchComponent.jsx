import React from "react";
import { IoIosSearch } from "react-icons/io";

const SearchComponent = ({ setSearchQuery }) => {
  return (
    <div className="relative w-full">
      <IoIosSearch
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        size={20}
      />
      <input
        type="text"
        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search..."
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} // Convert search query to lowercase for case-insensitive search
      />
    </div>
  );
};

export default SearchComponent;
