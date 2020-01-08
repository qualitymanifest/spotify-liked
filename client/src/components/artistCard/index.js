import { h } from "preact";
import { MdQueue, MdQueueMusic, MdPlayCircleFilled } from "react-icons/md";

import style from "./style";
import { QUEUE, VIEW, PLAY } from "../../utils/constants";

const ArtistCard = ({ artist }) => (
  <div className={`${style.card} mx-1 my-1`}>
    <h5 className={style.cardTitle}>{artist.name}</h5>
    <div
      title={`Play ${artist.name}`}
      className={style.cardArtist}
      data-action={PLAY}
      data-id={artist.artistId}
    >
      <img src={artist.image} className="mw-100 mh-100" />
      <MdPlayCircleFilled
        size="3em"
        className={`${style.cardSvg} ${style.play}`}
      />
    </div>
    <div className="d-flex justify-content-around">
      <MdQueue
        title={`Queue ${artist.name}`}
        size="2em"
        className={`${style.cardSvg} my-2`}
        data-action={QUEUE}
        data-id={artist.artistId}
      />
      <MdQueueMusic
        title={`View tracks by ${artist.name}`}
        size="2em"
        className={`${style.cardSvg} my-2`}
        data-action={VIEW}
        data-id={artist.artistId}
      />
    </div>
  </div>
);

export default ArtistCard;
