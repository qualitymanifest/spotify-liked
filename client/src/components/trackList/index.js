import { h } from "preact";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import style from "./style";
import { playTracks } from "../../utils/requests";
import animateAndCall from "../../utils/animateAndCall";

const TrackList = ({ artist, setSelectedArtist, addToast }) => {
  const close = () => setSelectedArtist(null);
  const selectTrack = async (artistId, trackUri, className) => {
    const el = document.querySelector(`.${className}`);
    const res = await animateAndCall(
      el,
      playTracks.bind(null, artistId, trackUri),
      style.loading,
      style.success
    );
    if (res.status === 200) {
      return setTimeout(close, 600);
    }
    const json = await res.json();
    return addToast({ header: "error", body: json.message, delay: 5000 });
  };
  return (
    <>
      <Modal centered scrollable isOpen={Boolean(artist)} toggle={close}>
        <ModalHeader toggle={close}>{artist.name}</ModalHeader>
        <ModalBody>
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
        </ModalBody>
      </Modal>
    </>
  );
};

export default TrackList;
