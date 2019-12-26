const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const mongoose = require("mongoose");

const keys = require("../config/keys");
const User = mongoose.model("users");

// scopes: https://developer.spotify.com/documentation/general/guides/scopes/

passport.use(
	new SpotifyStrategy(
		{
			clientID: keys.spotifyClientID,
			clientSecret: keys.spotifyClientSecret,
			callbackURL: "http://localhost:3000/auth/spotify/callback",
			scope: [
				"user-read-email",
				"user-read-playback-state",
				"user-modify-playback-state"
			]
		},
		(accessToken, refreshToken, profile, done) => {
			console.log("accessToken", accessToken);
			console.log("refreshToken", refreshToken);
			console.log("profile", profile);
			new User({ spotifyId: profile.id }).save();
		}
	)
);
