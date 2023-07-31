import { makeAutoObservable } from 'mobx';
import FriendsButtonUI from './RoomBar/FriendsButtonUI';
import RoomUI from './RoomUI';

export default class RoomBarUI {
  roomUI: RoomUI;
  friendsButtonUI: FriendsButtonUI;

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
    this.friendsButtonUI = new FriendsButtonUI(this);
  }
}
