const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  spotifyId: String,
  displayName: String,
  emails: Array,
  accessToken: String,
  refreshToken: String,
  lastUpdate: Date,
  playlistId: String
});

mongoose.model("users", userSchema);
