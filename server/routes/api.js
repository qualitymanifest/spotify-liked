const axios = require("axios");
const mongoose = require("mongoose");

const UserArtist = mongoose.model("userArtist");
const User = mongoose.model("users");
const {
  createPlaylist,
  addTracksToPlaylist,
  getChunkedUris
} = require("../utils/apiHelpers");
require("../middleware/axios");

const getTracksForArtist = async (userId, artistId) => {
  return await UserArtist.findOne(
    {
      userId,
      artistId
    },
    "name artistId tracks"
  ).exec();
};

module.exports = app => {
  // Add tracks to the end of the playlist, without changing playback
  app.put("/api/queue_tracks/:artistId", async (req, res) => {
    const result = await getTracksForArtist(req.user.id, req.params.artistId);
    const chunkedUris = getChunkedUris(result.tracks, 100); // Max to add at once
    chunkedUris.forEach(
      async uris => await addTracksToPlaylist(uris, req.user)
    );
    res.sendStatus(200);
  });

  // Add tracks to the playlist and play them, with an optional offset
  app.put("/api/play_tracks/:artistId", async (req, res) => {
    const playbackOptions = {
      context_uri: `spotify:playlist:${req.user.playlistId}`
    };
    if (req.query.offset) {
      playbackOptions.offset = { uri: req.query.offset };
    }
    const result = await getTracksForArtist(req.user.id, req.params.artistId);
    const [firstUris, ...restUris] = getChunkedUris(result.tracks, 100); // Max to add at once
    await axios.put(
      `https://api.spotify.com/v1/playlists/${req.user.playlistId}/tracks`,
      { uris: firstUris },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.user.accessToken}`,
          userId: req.user.id
        }
      }
    );
    // If there were more than 100 uris, add the rest
    restUris.forEach(async uris => await addTracksToPlaylist(uris, req.user));
    setTimeout(async () => {
      // Start playback
      await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        playbackOptions,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.user.accessToken}`,
            userId: req.user.id
          }
        }
      );
      res.sendStatus(200);
    }, 750);
  });

  // Create the playlist we will use
  app.post("/api/playlist", async (req, res) => {
    const spotifyRes = await createPlaylist(
      req.user.id,
      req.user.spotifyId,
      req.user.accessToken
    );
    await User.findByIdAndUpdate(req.user.id, {
      playlistId: spotifyRes.data.id
    });
    res.sendStatus(201);
  });

  // Get tracks for a particular artist
  app.get("/api/liked_tracks/:artistId", async (req, res) => {
    const result = await getTracksForArtist(req.user.id, req.params.artistId);
    res.send(result);
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
  app.put("/api/liked_tracks", async (req, res) => {
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
          image: images ? images[images.length - 2].url : "", // Using album art, not worth trouble of getting artist images
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
    res.sendStatus(200);
  });
};
