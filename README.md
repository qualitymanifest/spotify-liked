Up until mid-2019, Spotify allowed you to view an alphabetically-sorted grid of all of the artists who you had liked songs from. For some reason this was changed so that you instead view them as a list, with one artist per line, based on who you listened to most recently. This creates a couple problems:

-   Artists who you haven't listened to recently end up further and further down the list, getting lost in the abyss.
-   Finding your liked songs for a particular artist is like finding a needle in a haystack.

The goal of this project is to create a UI for liked artists similar to the old grid. Steps that this will probably require:

1. Authenticate users (backend done). Create a playlist on their profile and save the provided `spotify:playlist` id.

    > The purpose of the playlist is because if we just [passed an array of URIs](https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/) to play, when the songs finish, the music stops. With a playlist, Spotify continues with a play queue after it finishes.

2. [Get a list of all of the user's liked songs](https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/), process them, and save the results in a database and possibly LocalStorage. Since these calls are limited to 50 results and a user can have up to 10,000 liked songs, this could require up to 200 API calls. So, users should probably be appropriately limited in the frequency that they can update their liked songs, and update requests should be put into a queue.
3. When the user visits the page, get their songs from the database/LocalStorage and display the results in an alphabetically-sorted grid.
4. Users can then play songs in the following ways:
  - Clicking a play button by the artist, at which point [their playlist tracks are replaced](https://developer.spotify.com/documentation/web-api/reference/playlists/replace-playlists-tracks/) and [playback is started on that playlist](https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/)
  - Clicking into the artist in which case they see a list of all of their liked songs by that artist. When they click on a song, the process is the same as the above except that an `offset` is provided for the track's position in the playlist.
