import { h, Component } from "preact";

import ArtistCard from "../artistCard";
import { QUEUE, VIEW, PLAY } from "../../utils/constants";
import { playTracks, queueTracks } from "../../utils/requests";

const searchElementPath = (el, count = 0) => {
  // SVG children elements were swallowing clicks if, even if
  // they were on a button. Look upward a few elements
  if (!el || count >= 3) return null;
  const { action, id } = el.dataset;
  if (!action) {
    return searchElementPath(el.parentNode, ++count);
  }
  return { action, id };
};

// The purpose of this class is to eliminate potentially thousands
// of click event listeners (3 per card)
class ArtistCardContainer extends Component {
  componentDidMount() {
    window.addEventListener("click", e => {
      const data = searchElementPath(e.target);
      if (data) {
        if (data.action === PLAY) {
          playTracks(data.id);
        }
        if (data.action === QUEUE) {
          queueTracks(data.id);
        }
      }
    });
  }
  render({ artists }) {
    return (
      <>
        {artists.map(artist => (
          <ArtistCard artist={artist} />
        ))}
      </>
    );
  }
}

export default ArtistCardContainer;
