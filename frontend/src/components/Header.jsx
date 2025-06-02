import React, { useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import NewReleases from "./NewReleases";

export default function Header() {

  const [currentSongImage, setCurrentSongImage] = useState(null);
  const [currentSongTitle, setCurrentSongTitle] = useState(null);
  const [currentSongArtist, setCurrentSongArtist] = useState(null);

 
  return (
    <>
      <header
        style={{
          backgroundImage: `url(${
            // currentSongImage ||
            "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
          })`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="relative h-96 flex items-center justify-center text-white"
      >
        {currentSongTitle && currentSongArtist && (
          <div className="absolute text-white text-center hidden xl:block">
            <p className="text-3xl md:text-8xl font-bold mb-2 drop-shadow-2xl">
              {currentSongTitle}
            </p>
            <p className="text-xl md:text-2xl text-gray-50 font-medium mb-2 drop-shadow-2xl">
              {currentSongArtist}
            </p>
          </div>
        )}
      </header>
      <NewReleases
        setCurrentSongArtist={setCurrentSongArtist}
        setCurrentSongTitle={setCurrentSongTitle}
        setCurrentSongImage={setCurrentSongImage}
      />
    </>
  );
}
