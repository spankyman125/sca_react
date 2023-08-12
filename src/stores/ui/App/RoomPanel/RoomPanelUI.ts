import { makeAutoObservable } from 'mobx';
import AppStore from '../AppStore';
import RoomUI from './RoomUI';

export default class SecondaryPanelUI {
  appUI: AppStore;
  roomsUI: Map<number, RoomUI>;

  constructor(appUI: AppStore) {
    makeAutoObservable(this);
    this.appUI = appUI;
    this.roomsUI = new Map();
  }

  ensureRoomUI(roomId: number): RoomUI {
    if (!this.roomsUI.has(roomId))
      this.roomsUI.set(roomId, new RoomUI(this, roomId));
    return this.roomsUI.get(roomId)!;
  }
}
