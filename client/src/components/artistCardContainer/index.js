import { h, Component } from "preact";

import cardStyle from "../artistCard/style";
import ArtistCard from "../artistCard";
import TrackList from "../trackList";
import { QUEUE, VIEW, PLAY } from "../../utils/constants";
import { playTracks, queueTracks, getLikedTracks } from "../../utils/requests";

const searchElementPath = (el, count = 0) => {
  // SVG children elements were swallowing clicks if, even if
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
  toggleModal = bool => this.setState({ showModal: bool });
  componentDidMount() {
    window.addEventListener("click", async e => {
      const data = searchElementPath(e.target);
      if (data) {
        const existingSuccess = document.querySelector(`.${cardStyle.success}`);
        if (existingSuccess) {
          existingSuccess.classList.remove(cardStyle.success);
        }
        if (data.action === PLAY) {
          data.el.classList.add(cardStyle.loading);
          await playTracks(data.id, data.uri);
          data.el.classList.remove(cardStyle.loading);
          data.el.classList.add(cardStyle.success);
        }
        if (data.action === QUEUE) {
          data.el.classList.add(cardStyle.loading);
          await queueTracks(data.id);
          data.el.classList.remove(cardStyle.loading);
          data.el.classList.add(cardStyle.success);
        }
        if (data.action === VIEW) {
          const result = await getLikedTracks(data.id);
          this.setState({ selectedArtist: result });
          this.toggleModal(true);
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
            toggleModal={this.toggleModal}
          />
        )}
      </>
    );
  }
}

export default ArtistCardContainer;
