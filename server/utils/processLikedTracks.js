const processLikedTracks = (likedTracks, userId) => {
  const artists = {};
  // Process tracks into format for DB
  likedTracks.forEach(({ track }) => {
    let images = track.album.images;
    let [artist, ...featuredArtists] = track.artists; // Primary artist seems to always be first
    const processedTrack = {
      uri: track.uri,
      name: track.name,
      albumName: track.album.name,
      duration: Math.floor(track.duration_ms / 1000),
      featuredArtists: featuredArtists.map(fa => fa.name)
    };
    if (!artists[artist.id]) {
      const nameFirstLetter = artist.name[0]
        .toUpperCase()
        .replace(/[^A-Z]/g, "");
      artists[artist.id] = {
        userId,
        artistId: artist.id,
        name: artist.name,
        nameFirstLetter,
        image: images ? images[images.length - 2].url : "", // Using album art, not worth trouble of getting artist images
        tracks: [processedTrack]
      };
    } else {
      artists[artist.id].tracks.push(processedTrack);
    }
  });
  let artistsArr = Object.values(artists);
  // Group tracks by album
  artistsArr.map(artist =>
    artist.tracks.sort((a, b) => (a.albumName >= b.albumName ? 1 : -1))
  );
  return artistsArr;
};

module.exports = processLikedTracks;
