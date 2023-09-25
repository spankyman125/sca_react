export const STATIC_URL =
  process.env.NODE_ENV === 'development'
    ? `https://${location.hostname}:30125/`
    : `https://${location.host}/`;
