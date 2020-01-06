import { h } from "preact";
import { MdQueue, MdQueueMusic } from "react-icons/md";

import style from "./style";
import { QUEUE, VIEW, PLAY } from "../../utils/constants";

const ArtistCard = ({ artist }) => (
  <div className={`${style.card} mx-1 my-1`}>
    <span
      title={`Play ${artist.name}`}
      className="cardArtist"
      data-action={PLAY}
      data-id={artist.artistId}
    >
      <h5 className={style.cardTitle}>{artist.name}</h5>
      <img src={artist.image} className="mw-100" />
    </span>
    <div className="d-flex justify-content-around">
      <MdQueue
        title={`Queue ${artist.name}`}
        size="2em"
        className="my-2"
        data-action={QUEUE}
        data-id={artist.artistId}
      />
      <MdQueueMusic
        title={`View tracks by ${artist.name}`}
        size="2em"
        className="my-2"
        data-action={VIEW}
        data-id={artist.artistId}
      />
    </div>
  </div>
);

export default ArtistCard;
