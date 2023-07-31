import { makeAutoObservable } from 'mobx';
import AppStore from '../AppStore';
import MainRoomsUI from './MainRoomsUI';
import MainBarUI from './MainBarUI';

export default class MainPanelUI {
  appUI: AppStore;
  roomListUI: MainRoomsUI;
  mainBarUI: MainBarUI;

  constructor(appUI: AppStore) {
    makeAutoObservable(this);
    this.appUI = appUI;
    this.roomListUI = new MainRoomsUI(this);
    this.mainBarUI = new MainBarUI(this);
  }
}
