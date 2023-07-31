import AuthAPI from '../api/http/Auth';
import UsersAPI from '../api/http/Users';
import { User } from '../api/http/interfaces';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { makeAutoObservable, runInAction } from 'mobx';

export enum AuthStatus {
  Authorized = 'authorized',
  Unauthorized = 'unauthorized',
  Pending = 'pending',
}

interface UserInfo extends User {
  friends: User[];
}

class AuthStore {
  access_token = '';
  refresh_token = '';
  remember = false;
  user: UserInfo | undefined = undefined;
  status: AuthStatus = AuthStatus.Pending;

  constructor() {
    makeAutoObservable(this);
  }

  setAutoRestore(access_token: string, refresh_token: string) {
    Cookies.set('refresh_token', refresh_token);
    const tokenDecoded = jwt_decode<{ exp: number; iat: number }>(access_token);
    const timeout = tokenDecoded.exp - tokenDecoded.iat - 60;
    setTimeout(() => void this.restoreSession(), timeout * 1000);
  }

  async restoreSession() {
    const rememberedRefreshToken = Cookies.get('refresh_token');
    console.log('Cookies init, refresh_token: ', Cookies.get('refresh_token'));
    console.log('Cookies init, document cookie: ', document.cookie);
    if (rememberedRefreshToken) {
      try {
        const { access_token, refresh_token } = await AuthAPI.refresh(
          rememberedRefreshToken,
        );
        runInAction(() => {
          this.access_token = access_token;
          this.refresh_token = refresh_token;
        });
        const user = await UsersAPI.me();
        const friends = await UsersAPI.getFriendsSelf();
        runInAction(() => {
          this.user = { ...user, friends };
          this.status = AuthStatus.Authorized;
        });
        this.setAutoRestore(access_token, refresh_token);
      } catch (e) {
        this.status = AuthStatus.Unauthorized;
        throw e;
      }
    } else {
      this.status = AuthStatus.Unauthorized;
      throw new Error('No previous session');
    }
  }

  async getTokens(username: string, password: string) {
    return await AuthAPI.login(username, password);
  }

  async login(username: string, password: string, remember = false) {
    console.log('login');
    try {
      const { access_token, refresh_token } = await AuthAPI.login(
        username,
        password,
      );
      runInAction(() => {
        console.log('Setting auth tokens');
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.remember = remember;
      });
      console.log('Getting user info from api');
      const user = await UsersAPI.me();
      const friends = await UsersAPI.getFriendsSelf();
      runInAction(() => {
        console.log('Setting user info from api');
        this.user = { ...user, friends };
        this.status = AuthStatus.Authorized;
      });
      console.log('Setting refresh cookie');
      if (remember) Cookies.set('refresh_token', refresh_token);
      console.log(
        'Cookies after set, refresh token: ',
        Cookies.get('refresh_token'),
      );
      console.log('Cookies after set, document cookie: ', document.cookie);

      // SocketService.init(access_token);
    } catch (e) {
      console.log('Error occured', e);
      runInAction(() => {
        this.status = AuthStatus.Unauthorized;
      });
      throw e;
    }
  }

  logout() {
    this.access_token = '';
    this.refresh_token = '';
    this.remember = false;
    this.status = AuthStatus.Unauthorized;
  }
}
export const authStore = new AuthStore();
void authStore.restoreSession();
