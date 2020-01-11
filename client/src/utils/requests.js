export const fetchUser = async () => {
  const res = await fetch("/auth/current_user");
  return await res.json();
};

export const playTracks = async (artistId, trackUri) => {
  const offset = trackUri ? `?offset=${trackUri}` : "";
  return await fetch(`/api/play_tracks/${artistId}${offset}`, {
    method: "PUT"
  });
};

export const queueTracks = async artistId => {
  return await fetch(`/api/queue_tracks/${artistId}`, { method: "PUT" });
};

export const getLikedTracks = async (artistId = "") => {
  const res = await fetch(`/api/liked_tracks/${artistId}`);
  return await res.json();
};

export const updateLikedTracks = async () => {
  return await fetch("/api/liked_tracks", { method: "PUT" });
};

export const createPlaylist = async () => {
  return await fetch("/api/playlist", { method: "POST" });
};
