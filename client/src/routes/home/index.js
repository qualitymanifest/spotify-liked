import { h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import UserContext from "../../UserContext";
import { getLikedTracks } from "../../utils/requests";
import ArtistCardWrapper from "../../components/artistCardWrapper";

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
      <ArtistCardWrapper artists={artists} />
    </div>
  );
};

export default Home;
