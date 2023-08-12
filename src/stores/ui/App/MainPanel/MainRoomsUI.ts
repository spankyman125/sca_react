import { makeAutoObservable } from 'mobx';
import MainPanelUI from './MainPanelUI';
import RoomCreateDialogUI from './RoomCreateDialogUI';

export default class MainRoomsUI {
  mainPanelUI: MainPanelUI;

  roomCreateDialogUI: RoomCreateDialogUI;

  get rooms() {
    return this.mainPanelUI.appUI.rooms;
  }

  get activeRoomId() {
    return this.mainPanelUI.appUI.activeRoomId;
  }

  constructor(mainPanelUI: MainPanelUI) {
    makeAutoObservable(this);
    this.mainPanelUI = mainPanelUI;
    this.roomCreateDialogUI = new RoomCreateDialogUI(this);
  }
}
