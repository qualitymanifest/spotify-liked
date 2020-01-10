import { h } from "preact";
import { Modal } from "react-bootstrap";

import style from "./style";
import { playTracks } from "../../utils/requests";
import animateAndCall from "../../utils/animateAndCall";

const TrackList = ({ artist, setSelectedArtist, addToast }) => {
  const selectTrack = async (artistId, trackUri, className) => {
    const el = document.querySelector(`.${className}`);
    const res = await animateAndCall(
      el,
      playTracks.bind(null, artistId, trackUri),
      style.loading,
      style.success
    );
    if (res.status === 200) {
      return setTimeout(() => setSelectedArtist(null), 500);
    }
    const json = await res.json();
    return addToast({ header: "error", body: json.message, delay: 5000 });
  };
  return (
    <>
      <Modal
        centered
        scrollable
        show={Boolean(artist)}
        onHide={() => setSelectedArtist(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{artist.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {artist.tracks.map((track, idx) => (
            <div
              className={`${style.track} track${idx}`}
              onClick={() =>
                selectTrack(artist.artistId, track.uri, `track${idx}`)
              }
            >
              <p>{track.name}</p>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TrackList;
