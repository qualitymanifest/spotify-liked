import { h } from "preact";
import style from "./style";

import { playTracks } from "../../utils/requests";

const Home = () => (
  <div class={style.home}>
    <h1>Home</h1>
    <button
      onClick={() =>
        playTracks(
          "5F3fDx84RYnmx0FGZeRtSF",
          "spotify:track:3eCFpcj50ES6FqiFo9xqMC"
        )
      }
    >
      click
    </button>
    <p>This is the Home component.</p>
  </div>
);

export default Home;
