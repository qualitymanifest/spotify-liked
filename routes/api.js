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
  // Create or replace the user's liked songs on the DB
  app.post("/api/liked_tracks", async (req, res) => {
    let headers = {
      Authorization: `Bearer ${req.user.accessToken}`,
      userId: req.user.id
    };
    const getLikedTracks = async (
      accum = [],
      url = "https://api.spotify.com/v1/me/tracks"
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
        // It's possible that req.user.accessToken was expired and fixed by interceptor
        // Use the headers (and access token) that we know got a 200
        headers = spotifyRes.config.headers;
        if (spotifyRes.data.next) {
          return await getLikedTracks(accum, spotifyRes.data.next);
        }
        return accum;
      }
    };
    const likedTracks = await getLikedTracks();

    const artists = {};
    // Process tracks into format for DB
    likedTracks.forEach(({ track }) => {
      let images = track.album.images;
      let [artist, ...featuredArtists] = track.artists; // Primary artist seems to always be first
      const processedTrack = {
        uri: track.uri,
        name: track.name,
        albumName: track.album.name,
        duration: Math.floor(track.duration_ms / 1000),
        featuredArtists: featuredArtists.map(fa => fa.name)
      };
      if (!artists[artist.id]) {
        artists[artist.id] = {
          userId: req.user.id,
          artistId: artist.id,
          name: artist.name,
          image: images ? images[images.length - 1].url : "", // Using album art, not worth trouble of getting artist images
          tracks: [processedTrack]
        };
      } else {
        artists[artist.id].tracks.push(processedTrack);
      }
    });
    let artistsArr = Object.values(artists);
    // Group tracks by album
    artistsArr.map(artist =>
      artist.tracks.sort((a, b) => (a.albumName >= b.albumName ? 1 : -1))
    );
    // Maybe use a transaction? https://mongoosejs.com/docs/transactions.html
    await UserArtist.deleteMany({ userId: req.user.id });
    await UserArtist.insertMany(artistsArr);
    await User.findByIdAndUpdate(req.user.id, {
      lastUpdate: new Date()
    });
    res.send(200);
  });
};
