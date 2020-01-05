export const fetchUser = async () => {
  const res = await fetch("/auth/current_user");
  return await res.json();
};

export const playTracks = async (artistId, trackUri) => {
  const offset = trackUri ? `?offset=${trackUri}` : "";
  await fetch(`/api/play_tracks/${artistId}${offset}`, {
    method: "PUT"
  });
};

export const queueTracks = artistId => {
  fetch(`/api/queue_tracks/${artistId}`, { method: "PUT" });
};

export const getLikedTracks = async (artistId = "") => {
  const res = await fetch(`/api/liked_tracks/${artistId}`);
  return await res.json();
};

export const updateLikedTracks = () => {
  fetch("/api/liked_tracks", { method: "PUT" });
};

export const createPlaylist = () => {
  fetch("/api/playlist", { method: "POST" });
};
