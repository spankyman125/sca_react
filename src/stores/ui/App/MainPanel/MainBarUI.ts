import { makeAutoObservable } from 'mobx';
import MainPanelUI from './MainPanelUI';
import RoomCreateDialogUI from './RoomCreateDialogUI';

export default class MainBarUI {
  mainPanelUI: MainPanelUI;

  roomCreateDialogUI: RoomCreateDialogUI;

  constructor(mainPanelUI: MainPanelUI) {
    makeAutoObservable(this);
    this.mainPanelUI = mainPanelUI;
    this.roomCreateDialogUI = new RoomCreateDialogUI(this);
  }
}
