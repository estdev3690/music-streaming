import React, { useContext, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { PlayerContext } from "../context/PlayerContext";

export default function NewReleases({
  setCurrentSongArtist,
  setCurrentSongTitle,
  setCurrentSongImage,
}) {
  const { songsData, backendURL } = useContext(PlayerContext);
  const [playingSong, setPlayingSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  const handlePauseClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingSong(null);
      setCurrentTime(0);
      setDuration(0);
      setCurrentSongArtist(null);
      setCurrentSongImage(null);
      setCurrentSongTitle(null);
    }
  };

  const handlePlayClick = (song) => {
    if (playingSong && playingSong._id === song._id) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const filename = song.filePath?.split("\\").pop().split("/").pop();
    const audioSrc = `${backendURL}/upload/${filename}`;
    audioRef.current.src = audioSrc;
    audioRef.current.play();
    setPlayingSong(song);

    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration);
    };

    audioRef.current.ontimeupdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const imageUrl = `${backendURL}/${song.imageFilePath}`.replace(/\\/g, "/");
    setCurrentSongImage(imageUrl);
    setCurrentSongTitle(song.title);
    setCurrentSongArtist(song.artist);
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value;
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  };

  const handleProgressChange = (e) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="mt-6 px-4 mb-16">
      <div className="flex justify-between items-center text-white mb-4">
        <h1 className="text-2xl font-bold">New Releases</h1>
        <p className="text-sm text-red-200 hover:text-white cursor-pointer">
          See more
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songsData.map((song) => {
          const isPlaying = playingSong && playingSong._id === song._id;
          const imagePath = `${backendURL}/upload/${song.imageFilePath
            ?.split("\\")
            .pop()
            .split("/")
            .pop()}`;

          return (
            <div
              key={song._id}
              className="relative text-white bg-gray-900 rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={imagePath}
                alt={song.title}
                className="w-full h-40 object-cover object-top"
              />
              {isPlaying && (
                <div className="absolute bottom-15 left-2 right-2 bg-opacity-60 rounded-md p-2 z-20">
                  <div className="flex items-center justify-between gap-4">
                    {/* Volume control */}
                    <div className="absolute left-36 bottom-15 flex flex-col items-center mr-2 mb-2">
                      <label
                        htmlFor={`volume-${song._id}`}
                        className="text-xs text-gray-300 select-none  ml-5"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }} // Optional: vertical label
                      >
                        Volume
                      </label>
                      <input
                        type="range"
                        id={`volume-${song._id}`}
                        min="0"
                        max="100"
                        defaultValue={100}
                        onChange={handleVolumeChange}
                        style={{
                          transform: "rotate(-90deg)",
                          width: "100px",
                          height: "20px",
                        }}
                        className="cursor-pointer accent-red-600"
                      />
                    </div>

                    {/* Current Time / Duration */}
                    <div className="text-xs text-gray-300 min-w-[60px] text-right select-none">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  {/* Progress slider */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step="0.01"
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full  cursor-pointer appearance-none h-2 rounded bg-gray-700 accent-red-600 slider-thumb-red"
                  />
                </div>
              )}

              {/* Play/Pause button bottom-left corner */}
              <button
                onClick={() =>
                  isPlaying ? handlePauseClick() : handlePlayClick(song)
                }
                className="absolute bottom-4 right-3 bg-red-600 hover:bg-red-700 p-3 rounded-full text-white shadow-lg z-10 transition-colors duration-200"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              {/* Song info below image */}
              <div className="p-3">
                <p className="font-semibold truncate">{song.title}</p>
                <p className="text-sm text-gray-300 truncate">{song.artist}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper to format seconds to mm:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
