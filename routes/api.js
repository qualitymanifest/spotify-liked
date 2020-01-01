const axios = require("axios");

require("../middleware/axios");

module.exports = app => {
  // Update the user's liked songs
  app.put("/api/liked_songs", async (req, res) => {
    // Start out by using the user's current access token
    // If it fails, an axios interceptor will refresh the token and retry the call,
    // but req.user.accessToken will still be the same here. So, for recursive calls,
    // use the headers (and therefore the token) that gave us the 200 response
    const originalHeaders = {
      Authorization: `Bearer ${req.user.accessToken}`,
      userId: req.user.id
    };
    const getLiked = async (
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
          return await getLiked(
            accum,
            spotifyRes.data.next,
            spotifyRes.config.headers
          );
        }
        return accum;
      }
    };
    const liked = await getLiked();
    // TODO: Process and add to DB
  });
};
