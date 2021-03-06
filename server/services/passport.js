const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const mongoose = require("mongoose");

const keys = require("../config/keys");
const { createPlaylist } = require("../utils/requests");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  // Called after the callback function in the SpotifyStrategy
  // Set the user.id as a cookie
  // user.id is the mongoose _id, not spotifyId
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // Called after cookie-session extracts cookie data from request
  // and passport extracts the id from the cookie data
  // Get the user _id from the cookie and find the user,
  // then add the user to req as req.user
  const user = await User.findById(id);
  done(null, user);
});

// scopes: https://developer.spotify.com/documentation/general/guides/scopes/

passport.use(
  new SpotifyStrategy(
    {
      clientID: keys.spotifyClientID,
      clientSecret: keys.spotifyClientSecret,
      callbackURL: "/auth/spotify/callback",
      proxy: true,
      scope: [
        "playlist-modify-private",
        "user-library-read",
        "user-read-email",
        "user-read-playback-state",
        "user-modify-playback-state"
      ]
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ spotifyId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      } else {
        const user = await new User({
          spotifyId: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          accessToken,
          refreshToken
        }).save();
        // Create the playlist. Had to wait until after save to get user id
        const spotifyRes = await createPlaylist(
          user.id,
          profile.id,
          accessToken
        );
        await User.findByIdAndUpdate(user.id, {
          playlistId: spotifyRes.data.id
        });
        return done(null, user);
      }
    }
  )
);
