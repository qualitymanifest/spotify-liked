const axios = require("axios");
const mongoose = require("mongoose");

const UserArtist = mongoose.model("userArtist");
const User = mongoose.model("users");
require("../middleware/axios");

const getTracksForArtist = async (userId, artistId) => {
  return await UserArtist.findOne(
    {
      userId,
      artistId
    },
    "tracks"
  ).exec();
};

module.exports = app => {
  // Add tracks to the end of the playlist, without changing playback
  app.put("/api/queue_tracks/:artistId", async (req, res) => {
    const result = await getTracksForArtist(req.user.id, req.params.artistId);
    const trackUris = result.tracks.map(t => t.uri);
    await axios.post(
      `https://api.spotify.com/v1/playlists/${req.user.playlistId}/tracks`,
      { uris: trackUris },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.user.accessToken}`,
          userId: req.user.id
        }
      }
    );
    res.sendStatus(200);
  });

  // Add tracks to the playlist and play them, with an optional offset
  app.put("/api/play_tracks/:artistId", async (req, res) => {
    // TODO: If there is no active player, will get 404 with
    // error.response.data.error.reason === "NO_ACTIVE_DEVICE"
    // If this happens, present the user with a list of their devices:
    // https://developer.spotify.com/documentation/web-api/reference/player/get-a-users-available-devices/
    // and activate the one they choose:
    // https://developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/

    // TODO: Handle case where there are more than 100 tracks (Spotify max)
    // Could probably split out function for adding tracks from /queue_tracks route
    // TODO: Handle case where playlist does not exist
    const playbackOptions = {
      context_uri: `spotify:playlist:${req.user.playlistId}`
    };
    if (req.query.offset) {
      playbackOptions.offset = { uri: req.query.offset };
    }
    const result = await getTracksForArtist(req.user.id, req.params.artistId);
    const trackUris = result.tracks.map(t => t.uri);
    await axios.put(
      `https://api.spotify.com/v1/playlists/${req.user.playlistId}/tracks`,
      { uris: trackUris },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.user.accessToken}`,
          userId: req.user.id
        }
      }
    );
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
  });

  // Create the playlist we will use
  app.post("/api/playlist", async (req, res) => {
    const spotifyRes = await axios.post(
      `https://api.spotify.com/v1/users/${req.user.spotifyId}/playlists`,
      { name: "spotify-liked" },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${req.user.accessToken}`,
          userId: req.user.id
        }
      }
    );
    await User.findByIdAndUpdate(req.user.id, {
      playlistId: spotifyRes.data.id
    });
    res.sendStatus(201);
  });

  // Get tracks for a particular artist
  app.get("/api/liked_tracks/:artistId", async (req, res) => {
    const result = await getTracksForArtist(req.user.id, req.params.artistId);
    res.send(result.tracks);
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
    res.sendStatus(200);
  });
};
