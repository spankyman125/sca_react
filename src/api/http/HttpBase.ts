export default class HttpBase {
  public static path =
    process.env.NODE_ENV === 'development'
      ? `https://${location.hostname}:30125/api/`
      : `https://${location.host}/api/`;
}
