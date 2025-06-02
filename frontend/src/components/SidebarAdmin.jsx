import React from 'react';
import { MdLibraryMusic, MdAddCircle } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';

export default function SidebarAdmin() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-black to-gray-700 text-white w-20 lg:w-60 h-screen p-4 flex flex-col justify-between">
      {/* Logo or Home Icon */}
      <div
        onClick={() => navigate('/')}
        className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition-colors hidden lg:block"
      >
        Admin Panel
      </div>

      {/* Navigation Links */}
      <nav className="mt-10 space-y-6 text-base">
        <NavLink
          to="/add-music"
          className={({ isActive }) =>
            `flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gray-600 text-white'
                : 'hover:bg-gray-600 text-gray-300'
            }`
          }
        >
          <MdAddCircle size={24} />
          <span className="hidden lg:block">Add Music</span>
        </NavLink>

        <NavLink
          to="/list-songs"
          className={({ isActive }) =>
            `flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gray-600 text-white'
                : 'hover:bg-gray-600 text-gray-300'
            }`
          }
        >
          <MdLibraryMusic size={24} />
          <span className="hidden lg:block">List of Songs</span>
        </NavLink>
      </nav>
    </div>
  );
}
