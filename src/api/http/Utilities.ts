import { authStore } from '../../stores/AuthStore';

export class ApiError extends Error {
  response: Response;
  constructor(response: Response) {
    super();
    this.response = response;
  }
}

export async function api<T>(
  url: string,
  init?: RequestInit,
  signal?: AbortSignal,
): Promise<T> {
  const headers: Headers = new Headers({
    Authorization: `Bearer ${authStore.access_token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...init?.headers,
  });
  headers.forEach((value, header) => value === '' && headers.delete(header));
  const newInit: RequestInit = { ...init, headers };
  newInit.signal = signal;
  return fetch(url, newInit).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json() as Promise<T>;
    }
    throw new ApiError(response);
  });
}
