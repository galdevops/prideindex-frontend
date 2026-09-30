export const API_BASE = "https://pridedc.vercel.app/api";

export const PRIDE_INDEX_URL = `${API_BASE}/pride_index`;
export const profilesUrl = (countryCode) =>
  `${API_BASE}/p/${encodeURIComponent(countryCode)}`;
