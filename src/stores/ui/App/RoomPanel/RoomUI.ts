import { makeAutoObservable, runInAction } from 'mobx';
import RoomsAPI from '../../../../api/http/Rooms';
import { Message, User } from '../../../../api/http/interfaces';
import RoomAddDialogUI from './RoomAddDialogUI';
import RoomInfoUI from './RoomBar/RoomUsersUI';
import RoomBarUI from './RoomBarUI';
import RoomInputUI from './RoomInputUI';
import RoomMessagesUI from './RoomMessagesUI';
import SecondaryPanelUI from './RoomPanelUI';
import RoomCallUI from './RoomCallUI';

export default class RoomUI {
  secondaryPanelUI: SecondaryPanelUI;

  roomBarUI: RoomBarUI;
  roomMessagesUI: RoomMessagesUI;
  roomUsersUI: RoomInfoUI;
  roomInputUI: RoomInputUI;
  roomCallUI: RoomCallUI;
  roomAddDialogUI: RoomAddDialogUI;
  roomId: number;

  get appUI() {
    return this.secondaryPanelUI.appUI;
  }

  get room() {
    return this.appUI.getRoom(this.roomId)!;
  }

  constructor(secondaryPanelUI: SecondaryPanelUI, roomId: number) {
    makeAutoObservable(this);
    this.roomId = roomId;
    this.secondaryPanelUI = secondaryPanelUI;
    this.roomMessagesUI = new RoomMessagesUI(this);
    this.roomInputUI = new RoomInputUI(this);
    this.roomBarUI = new RoomBarUI(this);
    this.roomUsersUI = new RoomInfoUI(this);
    this.roomCallUI = new RoomCallUI(this);
    this.roomAddDialogUI = new RoomAddDialogUI(this);
    void this.fetchUsers();
  }

  async fetchUsers() {
    const users = await RoomsAPI.getUsers(this.roomId);
    runInAction(() => {
      this.room.users = users;
    });
  }

  async removeUser(userId: number) {
    await RoomsAPI.removeUser(this.roomId, userId);
    runInAction(() => {
      this.room.users = this.room?.users?.filter((user) => user.id !== userId);
    });
  }

  addUser(user: User) {
    this.room.users?.push(user);
  }

  addNewMessages(...messages: Message[]) {
    this.room.messages?.unshift(...messages);
  }

  addOldMessages(...messages: Message[]) {
    this.room.messages?.push(...messages);
  }
}
