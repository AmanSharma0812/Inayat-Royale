import PocketBase from 'pocketbase';

// Use env var for production, or direct PocketBase URL for dev (PocketBase allows all origins by default)
export const pb = new PocketBase('https://inayatroyalee.pockethost.io/');

// Disable auto-cancellation globally to prevent request interference
pb.autoCancellation(false);

export default pb;