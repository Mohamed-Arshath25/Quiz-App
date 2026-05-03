const API = import.meta.env.VITE_API_URL?.trim();

if (!API) {
  console.warn('VITE_API_URL is not defined. Frontend API requests will fail until it is configured.');
}

export default API;
