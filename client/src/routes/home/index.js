import { h } from "preact";
import style from "./style";

const Home = () => (
  <div class={style.home}>
    <h1>Home</h1>
    <a href="/auth/spotify">Sign in with Spotify</a>
    <p>This is the Home component.</p>
  </div>
);

export default Home;
