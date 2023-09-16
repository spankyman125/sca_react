import { makeAutoObservable } from 'mobx';
import UsersAPI from '../../../../api/http/Users';
import { User } from '../../../../api/http/interfaces';
import { UserInfo, authStore } from '../../../AuthStore';

export class UserInfoPanelUI {
  isOpened = false;
  isSelfUser = false;
  private fetchedUser?: UserInfo;

  get friends() {
    if (this.isSelfUser) return authStore.user?.friends;
    else return this.fetchedUser?.friends;
  }

  get user(): User | undefined {
    if (this.isSelfUser) return authStore.user;
    else return this.fetchedUser;
  }

  constructor() {
    makeAutoObservable(this);
  }

  async open(userId: number) {
    if (authStore.user?.id === userId) {
      this.isSelfUser = true;
    } else {
      this.isSelfUser = false;
      await this.fetch(userId);
    }
    this.isOpened = true;
  }

  close() {
    this.isOpened = false;
  }

  private async fetch(id: number) {
    const fetchedUser = await UsersAPI.getUser(id);
    this.fetchedUser = {
      ...fetchedUser,
      friends: await UsersAPI.getFriends(id),
    };
  }
}

export const userInfoPanelUI = new UserInfoPanelUI();
