const axios = require("axios");

const chunk = require("./chunk");

const getUserDevices = async user => {
  return await axios.get("https://api.spotify.com/v1/me/player", {
    Authorization: `Bearer ${user.accessToken}`,
    userId: user.id
  });
};

const transferPlayback = async (user, deviceId, startPlayback = false) => {
  return await axios.put(
    "https://api.spotify.com/v1/me/player",
    {
      device_ids: [deviceId],
      play: startPlayback
    },
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.accessToken}`,
      userId: user.id
    }
  );
};

const createPlaylist = async (userId, spotifyId, accessToken) => {
  return await axios.post(
    `https://api.spotify.com/v1/users/${spotifyId}/playlists`,
    { name: "spotify-liked", public: "false" },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        userId: userId
      }
    }
  );
};

const addTracksToPlaylist = async (trackUris, user) => {
  return await axios.post(
    `https://api.spotify.com/v1/playlists/${user.playlistId}/tracks`,
    { uris: trackUris },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
        userId: user.id
      }
    }
  );
};

const getChunkedUris = (tracks, size) => {
  const trackUris = tracks.map(t => t.uri);
  return chunk(trackUris, size);
};

module.exports = {
  createPlaylist,
  addTracksToPlaylist,
  getChunkedUris
};
