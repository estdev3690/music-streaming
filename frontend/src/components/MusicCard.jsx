import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { MdDelete } from "react-icons/md";
import { IoIosMicrophone } from "react-icons/io";
import { toast } from "react-toastify";

export default function MusicCard({ music, fetchSongs }) {
  const { backendURL, api } = useContext(PlayerContext);

  const filename = music.filePath.split("\\").pop().split("/").pop();
  const audioSrc = `${backendURL}/upload/${filename}`;

  const imageFilename = music.imageFilePath?.split("\\").pop().split("/").pop();
  const imageSrc = `${backendURL}/upload/${imageFilename}`;

  const handleDelete = async (id) => {
    try {
      const { data } = await api.delete(`/api/admin/delete-music/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchSongs();
      }
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error(error.response?.data?.message || "Error deleting song");
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-700 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img
        src={imageSrc}
        alt={music.title}
        className="w-full h-48 object-cover object-top hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate">{music.title}</h3>
          <MdDelete
            className="text-red-500 cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => handleDelete(music._id)}
            size={20}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <IoIosMicrophone size={18} />
          <span>{music.artist}</span>
        </div>

        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-300">Uploaded at:</span>{" "}
          {new Date(music.createdAt).toLocaleString()}
        </p>

        <audio controls className="w-full mt-2 rounded-md bg-black bg-opacity-30">
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
