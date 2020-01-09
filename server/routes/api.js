const axios = require("axios");
const mongoose = require("mongoose");

const UserArtist = mongoose.model("userArtist");
const User = mongoose.model("users");
const {
  getLikedTracks,
  createPlaylist,
  addTracksToPlaylist,
  getChunkedUris,
  getUserDevices,
  transferPlayback
} = require("../utils/apiHelpers");
const processLikedTracks = require("../utils/processLikedTracks");
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
      const playbackRes = await axios.put(
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
      if (playbackRes.response) {
        const errorData = playbackRes.response.data.error;
        if (
          errorData.status === 404 &&
          errorData.reason === "NO_ACTIVE_DEVICE"
        ) {
          // TODO: Present user with a list of their available devices
        }
      }
      res.sendStatus(playbackRes.status || playbackRes.response.status);
    }, 750); // Need to wait after replacing playlist
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
      {
        sort: { name: 1 },
        collation: { locale: "en_US" }
      },
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
    let likedTracks;
    try {
      likedTracks = await getLikedTracks(header);
    } catch (e) {
      console.log(`Failed to get tracks from Spotify for ${req.user.id}`, e);
      return res.status(500).send("Failed to get tracks from Spotify");
    }
    const processedTracks = processLikedTracks(likedTracks, req.user.id);
    try {
      const dbSession = await mongoose.startSession();
      await dbSession.withTransaction(async () => {
        await UserArtist.deleteMany(
          { userId: req.user.id },
          { session: dbSession }
        );
        await UserArtist.insertMany(processedTracks, { session: dbSession });
        await User.findByIdAndUpdate(
          req.user.id,
          {
            lastUpdate: new Date()
          },
          { session: dbSession }
        );
        res.sendStatus(200);
      });
    } catch (e) {
      console.log(`Failed to save tracks for ${req.user.id}`, e);
      return res.status(500).send("Failed to save tracks");
    }
  });
};
