const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const API = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '';

if (!API) {
  console.warn('VITE_API_URL is not defined. Frontend API requests will fail until it is configured.');
}

export default API;
