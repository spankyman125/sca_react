import { makeAutoObservable, runInAction } from 'mobx';
import UsersAPI from '../../../../api/http/Users';
import { User } from '../../../../api/http/interfaces';
import { authStore } from '../../../AuthStore';
import RoomUI from './RoomUI';
import RoomsAPI from '../../../../api/http/Rooms';

export interface ProposedUser extends User {
  inRoom: boolean;
}

export default class RoomAddDialogUI {
  roomUI: RoomUI;

  open = false;
  fetchedUsers: User[] = [];
  abortController: AbortController;
  searchedUsername = '';
  searchedPseudonym = '';

  get roomId() {
    return this.roomUI.roomId;
  }

  get proposedOthers(): ProposedUser[] {
    return this.fetchedUsers.map((fetchedUser) => {
      return {
        ...fetchedUser,
        inRoom: Boolean(
          this.roomUI.room?.users?.find(
            (userInRoom) => fetchedUser.id === userInRoom.id,
          ),
        ),
      };
    });
  }

  get proposedFriends(): ProposedUser[] {
    return this.friends
      .filter(
        (friend) =>
          friend.pseudonym.toLowerCase().includes(this.searchedPseudonym) ||
          friend.username.toLowerCase().includes(this.searchedUsername),
      )
      .map((friend) => {
        return {
          ...friend,
          inRoom: Boolean(
            this.roomUI.room?.users?.find(
              (userInRoom) => userInRoom.id === friend.id,
            ),
          ),
        };
      });
  }

  get friends(): User[] {
    return authStore.user?.friends ? authStore.user.friends : [];
  }

  setOpen(open: boolean) {
    this.open = open;
  }

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
    this.abortController = new AbortController();
  }

  async addToRoom(user: User) {
    // TODO: Add request pending handle
    await RoomsAPI.addUser(this.roomId, user.id);
    this.roomUI.addUser(user);
  }

  async search(username: string, pseudonym: string) {
    this.abortController.abort();
    const newAbortController = new AbortController();
    const fetchedUsers = await UsersAPI.search(
      username,
      pseudonym,
      newAbortController.signal,
    );
    runInAction(() => {
      this.abortController = newAbortController;
      this.searchedPseudonym = pseudonym.toLowerCase();
      this.searchedUsername = username.toLowerCase();
      this.fetchedUsers = fetchedUsers;
    });
  }
}
