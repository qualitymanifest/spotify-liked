import { h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import UserContext from "../../UserContext";
import { getLikedTracks } from "../../utils/requests";
import ArtistCard from "../../components/artistCard";

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
    <div class="d-flex flex-wrap justify-content-center">
      {artists.map(artist => (
        <ArtistCard artist={artist} />
      ))}
    </div>
  );
};

export default Home;
