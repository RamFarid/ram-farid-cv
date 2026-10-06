// Every R2 object key is new per upload and never overwritten, so objects can be cached for a year.
// See docs/console.md#uploads
export const immutableCacheControl = 'public, max-age=31536000, immutable'
