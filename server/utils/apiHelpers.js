const axios = require("axios");

const chunk = require("./chunk");

const getLikedTracks = async (
  headers,
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
    if (spotifyRes.data.next) {
      return await getLikedTracks(
        spotifyRes.config.headers,
        accum,
        spotifyRes.data.next
      );
    }
    return accum;
  }
};

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
  getLikedTracks,
  getUserDevices,
  transferPlayback,
  createPlaylist,
  addTracksToPlaylist,
  getChunkedUris
};
