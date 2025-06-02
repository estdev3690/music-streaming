import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { FaHeart, FaEllipsisH } from "react-icons/fa";
import { MdOutlineFeaturedPlayList } from 'react-icons/md';


export default function Display() {
  const { songsData, backendURL } = useContext(PlayerContext);
  console.log("songsData in Display:", songsData);

  if (!songsData || !Array.isArray(songsData)) {
    return (
      <div className="w-96 max-h-[600px] bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-4 mr-4 shadow-md">
        <p className="text-gray-400">Loading songs...</p>
      </div>
    );
  }

  return (
    <div className="w-96 max-h-[600px] bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-4 mr-4 overflow-y-auto shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-600 pb-3 mb-4">
        <h1 className="text-xl font-semibold">Top Streams</h1>
        <div className="flex gap-4 text-sm text-gray-300 cursor-pointer">
          <p className="hover:text-white">Local</p>
          <p className="hover:text-white">Global</p>
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-4">
        {songsData
          .map((song, index) => (
            <div
              key={song._id}
              className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <p className="w-5 text-gray-400 text-sm">{index + 1}</p>
                <img
                  src={`${backendURL}/upload/${song.imageFilePath
                    ?.split("\\")
                    .pop()
                    .split("/")
                    .pop()}`}
                  alt={song.title}
                  className="w-10 h-10 rounded-md object-cover" // <-- make image small and nice
                />
                <div className="flex flex-col truncate">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-gray-300 truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <FaHeart className="hover:text-red-500 text-gray-300 cursor-pointer transition-colors" />
                <FaEllipsisH className="hover:text-gray-100 text-gray-300 cursor-pointer transition-colors" />
              </div>
            </div>
          ))
          .slice(0, 5)}
        <div className="mt-3">
          <div className="flex justify-between mr-2 mb-2">
            <h1 className="text-lg text-white font-medium">categories</h1>
            <p className="text-red-500 cursor-pointer font-medium hover:text-white text-sm">see all</p>
          </div>
          <div className="w-96 overflow-hidden mr-2">
            <MdOutlineFeaturedPlayList/>
          </div>
        </div>
      </div>
    </div>
  );
}
