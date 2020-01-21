const mongoose = require("mongoose");
const { Schema } = mongoose;

const userArtistSchema = new Schema({
  userId: String,
  artistId: String,
  name: String,
  nameFirstLetter: String,
  image: String,
  tracks: [
    {
      uri: String,
      name: String,
      albumName: String,
      duration: String,
      featuredArtists: Array
    }
  ]
});

mongoose.model("userArtist", userArtistSchema);
