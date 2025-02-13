import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const SignUpRequest = async (data) => {
  const response = await axios.post(
    `${BACKEND_URL}/signup`,
    {
      username: data.username,
      email: data.email,
      password: data.password,
    },
    { withCredentials: true }
  );
  return response;
};

export const LoginRequest = async (data) => {
  const response = await axios.post(
    `${BACKEND_URL}/login`,
    {
      email: data.email,
      password: data.password,
    },
    { withCredentials: true }
  );
  return response;
};

export const LogOutRequest = async () => {
  const response = await axios.post(
    `${BACKEND_URL}/logout`,
    {},
    { withCredentials: true }
  );
  return response;
};

export const GetMyChatsRequest = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/chat`, {
      withCredentials: true, // Make sure cookies are sent
    });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const RenameGroupRequest = async (chatId, newchatname) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/chat/renamegroup`,
      { chatId, newchatname },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const GetAllUsersRequest = async (searchQuery) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/users?search=${searchQuery}`,
      { withCredentials: true }
    );

    return response;
  } catch (error) {
    console.log(error);
    return response;
  }
};

export const CreateChatRequest = (userID) => {
  return axios.post(
    `${BACKEND_URL}/chat`,
    { userID },
    { withCredentials: true }
  );
};
export const CreateGroupChatRequest = async (name, users) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/chat/group`,
      {
        name,
        users,
      },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const RemoveMemebersRequest = async (chatId, userIds) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/chat/removefromgroup`,
      { chatId, userIds },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const AddMemebersRequest = async (chatId, userIds) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/chat/addtogroup`,
      { chatId, userIds },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    return error;
  }
};
