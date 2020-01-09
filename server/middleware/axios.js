const axios = require("axios");
const mongoose = require("mongoose");

const keys = require("../config/keys");
const User = mongoose.model("users");

// Intercept 401s from Spotify and try to refresh the user's access token
axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    console.log(error.response.status);
    const { config } = error; // The request that led here
    if (error.response.status === 401) {
      const user = await User.findById(config.headers.userId);
      // Get the new token
      const refreshTokenReq = await axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        params: {
          grant_type: "refresh_token",
          refresh_token: user.refreshToken
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            keys.spotifyClientID + ":" + keys.spotifyClientSecret
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      // Save the new token
      await User.findByIdAndUpdate(config.headers.userId, {
        accessToken: refreshTokenReq.data.access_token
      });
      // Retry the old request with the new access token
      config.headers.Authorization = `Bearer ${refreshTokenReq.data.access_token}`;
      return axios(config);
    }
    return Promise.reject(error);
  }
);
