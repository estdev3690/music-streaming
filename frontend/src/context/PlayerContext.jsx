import { useEffect, useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import cookie from "js-cookie";

// ✅ This is what was missing:
export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const backendURL = "https://music-streaming-d0bo.onrender.com";
  const [token, setToken] = useState(Boolean(cookie.get("token")));


  const handleRegister = async (name, email, password) => {
    try {
      // Trim inputs
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
  
      if (password.length > 5) {
        toast.error("Password must be at least 5 characters");
        return;
      }
  
      const { data } = await axios.post(
        `${backendURL}/api/admin/register`,
        { username: trimmedName, email: trimmedEmail, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (data.success) {
        cookie.set("token", data.token, { expires: 7 });
        setToken(true);
        toast.success(data.message || "User Registered Successfully");
      }
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        toast.error("Registration failed: " + (error.response.data.message || "Unknown error"));
      } else {
        console.error(error);
      }
    }
  };
  

  const handleLogin = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/admin/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success(data.message || "User login Successfully");
        return { success: true, user: data.user };  // <--- Return user info
      }
      return { success: false };
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed: " + (error.response?.data?.message || error.message));
      return { success: false };
    }
  };
  

  const [songsData, setSongsData] = useState([]);

  const fetchSongs = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/admin/get-music`);
      setSongsData(data.musics);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const values = {
    backendURL,
    songsData,
    fetchSongs,
    token,
    setToken,
    handleRegister,
    handleLogin,
  };

  return (
    <PlayerContext.Provider value={values}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
