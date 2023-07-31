import { makeAutoObservable } from 'mobx';
import RoomBarUI from '../RoomBarUI';

export default class FriendsButtonUI {
  roomBarUI: RoomBarUI;

  constructor(roomBarUI: RoomBarUI) {
    makeAutoObservable(this);
    this.roomBarUI = roomBarUI;
  }

  click() {
    this.roomBarUI.roomUI.roomUsersUI.setOpen(true);
  }
}
