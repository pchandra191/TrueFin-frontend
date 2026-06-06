import api from "./api";

function unwrap(res) {
  return res.data;
}

export const trackLogin = (uniqueId) =>
  api.post("/api/track/login", { uniqueId }).then(unwrap);

export const getTrackByUniqueId = (uniqueId) =>
  api.get(`/api/track/${encodeURIComponent(uniqueId)}`).then(unwrap);
