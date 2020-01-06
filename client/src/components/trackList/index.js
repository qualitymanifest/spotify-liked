import { h } from "preact";
import { Modal } from "react-bootstrap";

import style from "./style";
import { playTracks } from "../../utils/requests";

const TrackList = ({ artist, show, toggleModal }) => {
  const selectTrack = async (artistId, trackUri) => {
    await playTracks(artistId, trackUri);
    toggleModal(false);
  };
  return (
    <>
      <Modal centered scrollable show={show} onHide={() => toggleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{artist.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {artist.tracks.map(track => (
            <div
              className={style.track}
              onClick={() => selectTrack(artist.artistId, track.uri)}
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
