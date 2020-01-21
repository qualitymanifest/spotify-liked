import { h } from "preact";
import { GoMarkGithub } from "react-icons/go";

import style from "./style";

const About = () => (
  <main className={style.wrapper}>
    <div className="text-center mb-3">
      <a href="https://github.com/qualitymanifest/spotify-liked">
        <GoMarkGithub size="3em" />
      </a>
    </div>
    <p>
      Up until mid-2019, Spotify allowed you to view an alphabetically-sorted
      grid of all of the artists who you had liked songs from. This was changed
      so that you instead view them as a list based on who you have listened to
      most recently. This creates a couple problems:
    </p>
    <ul>
      <li>
        Artists who you haven't listened to recently end up further and further
        down the list, getting lost in the abyss.
      </li>
      <li>
        Finding your liked songs for a particular artist is like finding a
        needle in a haystack.
      </li>
    </ul>
    <p>
      The current solution from Spotify is to follow all of the artists you have
      liked songs from. This restores the alphabetic sorting, but what if you
      don't want to follow every one of those artists? Maybe you really like{" "}
      <i>Party In The USA</i> but you don't want to receive every single update
      about Miley Cyrus. You get the picture.
    </p>
    <hr />
    <p>
      The goal of this project is to recreate the previous sorted grid.{" "}
      <b>
        Due to being a web app and depending on the Spotify Web API, there are
        several limitations:
      </b>
    </p>
    <ul>
      <li>
        You must have an open Spotify player. At present, it must also be
        considered "active" by Spotify due to inconsistency in their API for
        fetching available devices. Basically, you might need to hit the play
        button to reactivate it if it's been sitting for a while without playing
        a song.
      </li>
      <li>You must have a network connection.</li>
      <li>
        Liked songs don't automatically sync. You must click a button to sync
        them and you are limited in how frequently you can do that.
      </li>
    </ul>
    <hr />
    <p>
      For problems or feature requests please leave an issue at the{" "}
      <a href="https://github.com/qualitymanifest/spotify-liked">GitHub repo</a>
    </p>
  </main>
);

export default About;
