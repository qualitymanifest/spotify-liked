import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import cardStyle from "../artistCard/style";
import ArtistCard from "../artistCard";
import QuickScroll from "../quickScroll";
import TrackList from "../trackList";
import { QUEUE, VIEW, PLAY } from "../../utils/constants";
import animateAndCall from "../../utils/animateAndCall";
import { playTracks, queueTracks, getLikedTracks } from "../../utils/requests";

// The purpose of this component is to eliminate potentially thousands
// of click event listeners (3 per card * lots of cards)
const ArtistCardContainer = ({ artists, addToast }) => {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const handleClick = async e => {
    const data = e.target.dataset;
    if (!data) return;
    if (data.action === PLAY) {
      const res = await animateAndCall(
        e.target,
        playTracks.bind(null, data.id, data.uri),
        cardStyle.loading,
        cardStyle.success
      );
      if (res.status === 200) return;
      const json = await res.json();
      return addToast({ header: "error", body: json.message, delay: 5000 });
    }
    if (data.action === QUEUE) {
      return await animateAndCall(
        e.target,
        queueTracks.bind(null, data.id),
        cardStyle.loading,
        cardStyle.success
      );
    }
    if (data.action === VIEW) {
      const result = await getLikedTracks(data.id);
      setSelectedArtist(result);
    }
  };
  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
  const firstLetters = new Set();
  const artistCards = artists.map(artist => {
    firstLetters.add(artist.nameFirstLetter);
    return <ArtistCard firstLetter={artist.nameFirstLetter} artist={artist} />;
  });
  // Artist names that start with punctuation or numbers don't have a first letter
  // Better to do this here than check every artist
  firstLetters.delete("");
  return (
    <>
      {artistCards}
      <QuickScroll letters={Array.from(firstLetters)} />
      {selectedArtist && (
        <TrackList
          artist={selectedArtist}
          setSelectedArtist={setSelectedArtist}
          addToast={addToast}
        />
      )}
    </>
  );
};

export default ArtistCardContainer;
