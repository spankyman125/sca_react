import HttpBase from './HttpBase';
import { api } from './Utilities';
import { Credentials } from './interfaces';

export default class AuthAPI extends HttpBase {
  static path: string = HttpBase.path + 'auth';

  static async login(username: string, password: string) {
    return api<Credentials>(this.path + '/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
  }

  static async refresh(refresh_token: string) {
    return api<Credentials>(this.path + '/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: refresh_token,
      }),
    });
  }
}
