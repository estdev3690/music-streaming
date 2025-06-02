import React, { useContext, useState, useEffect } from "react";
import {PlayerContext} from "../context/PlayerContext";
import axios from "axios";
import MusicCard from "../components/MusicCard";

export default function ListSong() {
  const {backendURL} = useContext(PlayerContext);

  const [musics, setMusics] = useState([]);

  const fetchSongs = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/admin/get-music`);

      setMusics(data.musics);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Music Library</h1>
      {musics.length === 0 ? (
        <p>No songs found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {musics.map((music) => (
            <MusicCard key={music._id} music={music} fetchSongs={fetchSongs} />
          ))}
        </div>
      )}
    </div>
  );
}
