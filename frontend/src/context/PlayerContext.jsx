import { useEffect, useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import cookie from "js-cookie";

// ✅ This is what was missing:
export const PlayerContext = createContext();

// Configure axios defaults
axios.defaults.withCredentials = true;

const PlayerContextProvider = ({ children }) => {
  const backendURL = "https://music-streaming-d0bo.onrender.com";
  const [token, setToken] = useState(Boolean(cookie.get("token")));

  // Configure axios instance with proper defaults
  const api = axios.create({
    baseURL: backendURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const handleRegister = async (name, email, password) => {
    try {
      // Trim inputs
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
  
      if (password.length > 5) {
        toast.error("Password must be at least 5 characters");
        return;
      }
  
      const { data } = await api.post(
        '/api/admin/register',
        { username: trimmedName, email: trimmedEmail, password }
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
      const { data } = await api.post(
        '/api/admin/login',
        { email, password }
      );
  
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(true);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
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
      const { data } = await api.get('/api/admin/get-music');
      setSongsData(data.musics);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast.error("Failed to fetch songs");
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
    api // Export the configured axios instance
  };

  return (
    <PlayerContext.Provider value={values}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
