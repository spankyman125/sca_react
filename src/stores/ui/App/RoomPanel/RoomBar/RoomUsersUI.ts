import { makeAutoObservable } from 'mobx';
import { User } from '../../../../../api/http/interfaces';
import RoomUI from '../RoomUI';

export default class RoomInfoUI {
  roomUI: RoomUI;
  opened = false;

  get users(): User[] {
    return this.roomUI.room?.users ? this.roomUI.room.users : [];
  }

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
  }

  async removeUser(userId: number) {
    await this.roomUI.removeUser(userId);
  }

  setOpen(opened: boolean) {
    this.opened = opened;
  }
}
