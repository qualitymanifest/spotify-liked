const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  spotifyId: String,
  accessToken: String,
  refreshToken: String,
  lastUpdate: Date
});

mongoose.model("users", userSchema);
