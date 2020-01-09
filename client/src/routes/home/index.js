import { h } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { Link } from "wouter-preact";

import UserContext from "../../utils/UserContext";
import { getLikedTracks } from "../../utils/requests";
import ArtistCardContainer from "../../components/artistCardContainer";

const Home = () => {
  const user = useContext(UserContext);
  const [artists, setArtists] = useState(null);
  useEffect(async () => {
    if (user) {
      const res = await getLikedTracks();
      setArtists(res);
    }
  }, [user]);
  return (
    <main class="d-flex flex-wrap justify-content-center">
      {!user && (
        <p className="mt-4">
          <a href="/auth/spotify">Log in or sign up</a> to view your liked
          tracks
        </p>
      )}
      {artists && !artists.length && (
        <p className="mt-4">
          Visit your <Link href="/settings">settings</Link> to upload your liked
          tracks
        </p>
      )}
      <ArtistCardContainer artists={artists || []} />
    </main>
  );
};

export default Home;
