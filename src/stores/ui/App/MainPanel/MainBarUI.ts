import { makeAutoObservable } from 'mobx';
import MainPanelUI from './MainPanelUI';
import RoomCreateDialogUI from './RoomCreateDialogUI';

export default class MainBarUI {
  mainPanelUI: MainPanelUI;

  roomCreateDialogUI: RoomCreateDialogUI;
  searchedText = '';

  constructor(mainPanelUI: MainPanelUI) {
    makeAutoObservable(this);
    this.mainPanelUI = mainPanelUI;
    this.roomCreateDialogUI = new RoomCreateDialogUI(this);
  }

  setSearchedText(searchedText: string) {
    this.searchedText = searchedText;
  }
}
