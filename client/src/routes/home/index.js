import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Link } from "wouter-preact";

import { getLikedTracks } from "../../utils/requests";
import ArtistCardContainer from "../../components/artistCardContainer";

const Home = ({ user, addToast }) => {
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
      <ArtistCardContainer artists={artists || []} addToast={addToast} />
    </main>
  );
};

export default Home;
