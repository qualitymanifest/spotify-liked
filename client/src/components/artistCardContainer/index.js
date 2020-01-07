import { h, Component } from "preact";

import cardStyle from "../artistCard/style";
import ArtistCard from "../artistCard";
import TrackList from "../trackList";
import { QUEUE, VIEW, PLAY } from "../../utils/constants";
import animateAndCall from "../../utils/animateAndCall";
import { playTracks, queueTracks, getLikedTracks } from "../../utils/requests";

const searchElementPath = (el, count = 0) => {
  // SVG children elements were swallowing clicks, even if
  // they were on a button. Look upward a few elements
  if (!el || count >= 3) return null;
  const { action, id } = el.dataset;
  if (!action) {
    return searchElementPath(el.parentNode, ++count);
  }
  return { action, id, el };
};

// The purpose of this class is to eliminate potentially thousands
// of click event listeners (3 per card)
class ArtistCardContainer extends Component {
  state = { showModal: false, selectedArtist: null };
  shouldShowModal = bool => this.setState({ showModal: bool });
  componentDidMount() {
    window.addEventListener("click", async e => {
      const data = searchElementPath(e.target);
      if (data) {
        if (data.action === PLAY) {
          return await animateAndCall(
            data.el,
            playTracks.bind(null, data.id, data.uri),
            cardStyle.loading,
            cardStyle.success
          );
        }
        if (data.action === QUEUE) {
          return await animateAndCall(
            data.el,
            queueTracks.bind(null, data.id),
            cardStyle.loading,
            cardStyle.success
          );
        }
        if (data.action === VIEW) {
          const result = await getLikedTracks(data.id);
          this.setState({ selectedArtist: result });
          this.shouldShowModal(true);
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
        {this.state.selectedArtist && (
          <TrackList
            show={this.state.showModal}
            artist={this.state.selectedArtist}
            shouldShowModal={this.shouldShowModal}
          />
        )}
      </>
    );
  }
}

export default ArtistCardContainer;
