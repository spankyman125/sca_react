import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { makeAutoObservable, runInAction } from 'mobx';
import AuthAPI from '../api/http/Auth';
import UsersAPI from '../api/http/Users';
import { User } from '../api/http/interfaces';

export enum AuthStatus {
  Authorized = 'authorized',
  Unauthorized = 'unauthorized',
  Pending = 'pending',
}

export interface UserInfo extends User {
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
    }
  }

  async getTokens(username: string, password: string) {
    return await AuthAPI.login(username, password);
  }

  async login(username: string, password: string, remember = false) {
    try {
      const { access_token, refresh_token } = await AuthAPI.login(
        username,
        password,
      );
      runInAction(() => {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.remember = remember;
      });
      const user = await UsersAPI.me();
      const friends = await UsersAPI.getFriendsSelf();
      runInAction(() => {
        this.user = { ...user, friends };
        this.status = AuthStatus.Authorized;
      });
      if (remember) Cookies.set('refresh_token', refresh_token);
    } catch (e) {
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

  removeFriend(id: number) {
    if (this.user) {
      this.user.friends = this.user?.friends.filter(
        (friend) => friend.id !== id,
      );
      return UsersAPI.removeFriend(id);
    }
  }

  async addFriend(id: number) {
    if (this.user) {
      this.user.friends.push(await UsersAPI.addFriend(id));
    }
  }
}
export const authStore = new AuthStore();
void authStore.restoreSession();
