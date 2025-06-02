import React from 'react';
import { MdLibraryMusic, MdAddCircle } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';

export default function SidebarAdmin() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-black to-gray-700 text-white min-h-screen w-60 p-6 flex flex-col space-y-10 shadow-lg">
      {/* Logo or Home Icon */}
      <div
        onClick={() => navigate('/')}
        className="text-3xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
      >
        Admin Panel
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-6 text-base">
        <NavLink
          to="/add-music"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gray-600 text-white'
                : 'hover:bg-gray-600 text-gray-300'
            }`
          }
        >
          <MdAddCircle size={20} />
          Add Music
        </NavLink>

        <NavLink
          to="/list-songs"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gray-600 text-white'
                : 'hover:bg-gray-600 text-gray-300'
            }`
          }
        >
          <MdLibraryMusic size={20} />
          List of Songs
        </NavLink>
      </nav>
    </div>
  );
}
