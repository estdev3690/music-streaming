import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdHome,
  MdLibraryMusic,
  MdFavorite,
  MdExplore,
  MdLogin,
  MdLogout,
} from "react-icons/md";
import cookie from "js-cookie";
import { toast } from "react-toastify";

export default function Sidebar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(Boolean(cookie.get("token")));

  useEffect(() => {
    const interval = setInterval(() => {
      setToken(Boolean(cookie.get("token")));
    }, 1000); // check every second — or use a better reactive way if needed

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    toast.success("User logged out successfully");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-l from-black to-gray-700 text-white w-20 lg:w-64 h-screen p-4 flex flex-col justify-between">
      <div>
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition-colors hidden lg:block"
        >
          User Panel
        </div>

        <div className="mt-6 space-y-6 text-lg">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer hover:text-gray-300 transition"
          >
            <MdHome size={24} />
            <p className="hidden lg:block">Home</p>
          </div>

          <div
            onClick={() => navigate("/browse")}
            className="flex items-center gap-3 cursor-pointer hover:text-gray-300 transition"
          >
            <MdExplore size={24} />
            <p className="hidden lg:block">Browse</p>
          </div>

          <div
            onClick={() => navigate("/favourites")}
            className="flex items-center gap-3 cursor-pointer hover:text-gray-300 transition"
          >
            <MdFavorite size={24} />
            <p className="hidden lg:block">Favourites</p>
          </div>

          <div
            onClick={() => navigate("/library")}
            className="flex items-center gap-3 cursor-pointer hover:text-gray-300 transition"
          >
            <MdLibraryMusic size={24} />
            <p className="hidden lg:block">Library</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-600">
        {token ? (
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 cursor-pointer hover:text-red-400 transition text-red-300 mt-4"
          >
            <MdLogout size={24} />
            <p className="hidden lg:block">Login</p>
          </div>
        ) : (
          <div
            onClick={handleLogin}
            className="flex items-center gap-3 cursor-pointer hover:text-green-400 transition text-green-300 mt-4"
          >
            <MdLogin size={24} />
         
            <p className="hidden lg:block">Logout</p>
          </div>
        )}
      </div>
    </div>
  );
}
