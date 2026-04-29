import PocketBase from 'pocketbase';

// Use env var for production, or direct PocketBase URL for dev (PocketBase allows all origins by default)
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8091');

// Disable auto-cancellation globally to prevent request interference
pb.autoCancellation(false);

export default pb;