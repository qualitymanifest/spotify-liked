import { h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import style from "./style";
import UserContext from "../../UserContext";
import { playTracks, getLikedTracks } from "../../utils/requests";

const Home = () => {
  const user = useContext(UserContext);
  const [artists, setArtists] = useState([]);
  useEffect(async () => {
    if (user) {
      const res = await getLikedTracks();
      setArtists(res);
    }
  }, [user]);
  return (
    <div class={style.home}>
      <h1>Home</h1>
      {artists.map(artist => (
        <button onClick={() => playTracks(artist.artistId)}>
          {artist.name}
        </button>
      ))}
      <p>This is the Home component.</p>
    </div>
  );
};

export default Home;
