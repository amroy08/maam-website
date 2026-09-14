// In production (Vercel), frontend and backend share the same domain (relative paths)
// In local development, fallback to localhost:4000
const isProd = import.meta.env.PROD;

export const server = isProd ? "" : "http://localhost:4000";

export const backend_url = isProd ? "/" : "http://localhost:4000/";
