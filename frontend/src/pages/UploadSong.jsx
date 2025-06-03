import React, { useContext, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import { FiMusic, FiImage, FiCheckCircle } from "react-icons/fi"; // Add any icons you like
import { toast } from "react-toastify";

// Optional custom icons
const MusicSuccessUploaded = () => (
  <FiCheckCircle className="text-4xl text-blue-600" />
);
const ImageSuccessUploaded = () => (
  <FiCheckCircle className="text-4xl text-green-600" />
);

export default function UploadSong() {
  const { backendURL, api } = useContext(PlayerContext);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [songData, setSongData] = useState({
    title: "",
    artist: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", songData.title);
      formData.append("artist", songData.artist);
      formData.append("music", song);
      formData.append("image", image);

      const { data } = await api.post('/api/admin/add-music', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success(data.message || "Upload succeeded");
        navigate("/list-songs");
        setSongData({ title: "", artist: "" });
        setImage(null);
        setSong(null);
      } else {
        toast.error(data?.message || "Unexpected response from server.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Error occurred while uploading the song.");
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setSongData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 text-gray-800 w-full max-w-md mx-auto p-6 md:p-8 bg-white shadow-xl rounded-2xl border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Upload Media
        </h2>

        {/* Song Upload */}
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="song"
            className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-blue-400 hover:border-blue-600 transition-all"
          >
            {song ? (
              <MusicSuccessUploaded />
            ) : (
              <FiMusic className="text-4xl text-blue-500" />
            )}
            <span className="text-sm mt-2">Upload Song</span>
          </label>
          <input
            onChange={(e) => setSong(e.target.files[0])}
            type="file"
            id="song"
            accept="audio/*"
            hidden
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="image"
            className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-green-400 hover:border-green-600 transition-all"
          >
            {image ? (
              <ImageSuccessUploaded />
            ) : (
              <FiImage className="text-4xl text-green-500" />
            )}
            <span className="text-sm mt-2">Upload Image</span>
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
        </div>

        {/* Song Name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-gray-600"
          >
            🎵 Song Name
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={songData.title}
            onChange={onChangeHandler}
            placeholder="Enter song name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Artist Name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="artist"
            className="text-sm font-semibold text-gray-600"
          >
            🎤 Artist Name
          </label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={songData.artist}
            onChange={onChangeHandler}
            placeholder="Enter artist name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition w-full"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
