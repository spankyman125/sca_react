import { makeAutoObservable } from 'mobx';
import RoomUI from './RoomUI';

export default class RoomCallUI {
  roomUI: RoomUI;

  get mediasoupStore() {
    return this.roomUI.appUI.mediasoupStore;
  }

  get socketService() {
    return this.roomUI.appUI.socketService;
  }

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
  }
}
