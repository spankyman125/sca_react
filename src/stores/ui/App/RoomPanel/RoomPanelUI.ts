import { makeAutoObservable } from 'mobx';
import AppStore from '../AppStore';
import RoomUI from './RoomUI';

export default class RoomPanelUI {
  appUI: AppStore;
  roomsUI: RoomUI[];

  constructor(appUI: AppStore) {
    makeAutoObservable(this);
    this.appUI = appUI;
    this.roomsUI = [];
  }

  ensureRoomUI(roomId: number): RoomUI {
    const roomUI = this.roomsUI.find((roomUI) => roomUI.roomId === roomId);
    if (roomUI) return roomUI;
    else {
      const newRoomUI = new RoomUI(this, roomId);
      this.roomsUI.push(newRoomUI);
      return newRoomUI;
    }
  }
}
