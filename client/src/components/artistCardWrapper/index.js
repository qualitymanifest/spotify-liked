import { h, Component } from "preact";

import ArtistCard from "../../components/artistCard";
import { QUEUE, VIEW, PLAY } from "../../utils/constants";
import { playTracks, queueTracks } from "../../utils/requests";

// The purpose of this class is to eliminate potentially hundreds
// click event listeners
class ArtistCardWrapper extends Component {
  componentDidMount() {
    window.addEventListener("click", e => {
      const { action, id } = e.target.parentNode.dataset;
      if (action === PLAY) {
        playTracks(id);
      }
      if (action === QUEUE) {
        queueTracks(id);
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

export default ArtistCardWrapper;
