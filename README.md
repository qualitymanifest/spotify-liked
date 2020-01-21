<p align="center"><img src="https://user-images.githubusercontent.com/13897419/72846278-47639880-3c6e-11ea-9057-e4a77c5e1800.png" /></p>

Up until mid-2019, Spotify allowed you to view an alphabetically-sorted grid of all of the artists who you had liked songs from. This was changed so that you instead view them as a list based on who you have listened to most recently. This creates a couple problems:

-   Artists who you haven't listened to recently end up further and further down the list, getting lost in the abyss.
-   Finding your liked songs for a particular artist is like finding a needle in a haystack.

The current solution from Spotify is to follow all of the artists you have liked songs from. This restores the alphabetic sorting, but what if you don't want to follow every one of those artists? Maybe you really like *Party In The USA* but you don't want to receive every single update about Miley Cyrus. You get the picture.

---

The goal of this project is to recreate the previous sorted grid. **Due to being a web app and depending on the Spotify Web API, there are several limitations:**

-   You must have an available Spotify player for this app to control. What Spotify recognizes as an "available" player can be [inconsistent, particularly on mobile devices](https://github.com/spotify/web-api/issues/1423). Basically, you might need to hit the play button to reactivate it if it's been sitting in the background without playing a song.
-   You must have a network connection.
-   Liked songs don't automatically sync. You must click a button to sync them and you are limited in how frequently you can do that.
