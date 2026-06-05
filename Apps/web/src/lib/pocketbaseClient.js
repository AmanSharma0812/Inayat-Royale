import PocketBase from 'pocketbase';

// Use env var for production/dev if configured, or fall back to the remote instance
const pbUrl = import.meta.env.VITE_POCKETBASE_URL || 'https://inayatroyalee.pockethost.io/';
export const pb = new PocketBase(pbUrl);

// Disable auto-cancellation globally to prevent request interference
pb.autoCancellation(false);

export default pb;