const axios = require("axios");
const mongoose = require("mongoose");

const UserArtist = mongoose.model("userArtist");
const User = mongoose.model("users");
require("../middleware/axios");

module.exports = app => {
  // Get tracks for a particular artist
  app.get("/api/liked_tracks/:artistId", async (req, res) => {
    UserArtist.find(
      {
        userId: req.user.id,
        artistId: req.params.artistId
      },
      (err, artist) => {
        res.send(artist);
      }
    );
  });
  // Get an alphabetically sorted list of artists, without tracks
  app.get("/api/liked_tracks", async (req, res) => {
    UserArtist.find(
      { userId: req.user.id },
      "artistId name image",
      { sort: { name: 1 } },
      (err, artists) => {
        res.send(artists);
      }
    );
  });
  // Update the user's liked songs
  app.put("/api/liked_tracks", async (req, res) => {
    // Start out by using the user's current access token
    // If it fails, an axios interceptor will refresh the token and retry the call,
    // but req.user.accessToken will still be the same here. So, for recursive calls,
    // use the headers (and therefore the token) that gave us the 200 response
    const originalHeaders = {
      Authorization: `Bearer ${req.user.accessToken}`,
      userId: req.user.id
    };
    const getLikedTracks = async (
      accum = [],
      url = "https://api.spotify.com/v1/me/tracks",
      headers = originalHeaders
    ) => {
      const spotifyRes = await axios.get(url, {
        headers,
        params: {
          limit: 50 // max
        }
      });
      if (spotifyRes.status === 200) {
        accum.push(...spotifyRes.data.items);
        // Get the next 50 liked songs, or return if there are no more
        if (spotifyRes.data.next) {
          return await getLikedTracks(
            accum,
            spotifyRes.data.next,
            spotifyRes.config.headers
          );
        }
        return accum;
      }
    };
    const likedTracks = await getLikedTracks();

    const artists = {};
    // Process tracks into format for DB
    likedTracks.forEach(lt => {
      const track = {
        uri: lt.track.uri,
        name: lt.track.name,
        albumName: lt.track.album.name,
        duration: Math.floor(lt.track.duration_ms / 1000)
      };
      lt.track.artists.forEach(artist => {
        if (!artists[artist.name]) {
          artists[artist.name] = {
            userId: req.user.id,
            artistId: artist.id,
            name: artist.name,
            tracks: [track]
          };
        } else {
          artists[artist.name].tracks.push(track);
        }
      });
    });
    // Maybe use a transaction? https://mongoosejs.com/docs/transactions.html
    await UserArtist.deleteMany({ userId: req.user.id });
    await UserArtist.insertMany(Object.values(artists));
    await User.findByIdAndUpdate(req.user.id, {
      lastUpdate: new Date()
    });
    res.send(200);
  });
};
