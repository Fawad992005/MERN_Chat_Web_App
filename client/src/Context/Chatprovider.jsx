import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Chatcontext = createContext();

export const Chatstate = () => useContext(Chatcontext);

export const Chatprovider = ({ children }) => {
  const navigate = useNavigate();
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/currentuser", {
          withCredentials: true,
        });

        if (response.data.user) {
          setUser(response.data.user);
          navigate("/"); // Redirect to home only if user exists
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value = { User, setUser, loading };

  return <Chatcontext.Provider value={value}>{children}</Chatcontext.Provider>;
};
