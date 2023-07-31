import { makeAutoObservable, runInAction } from 'mobx';
import MainBarUI from './MainBarUI';
import RoomsAPI from '../../../../api/http/Rooms';

export default class RoomCreateDialogUI {
  mainBarUI: MainBarUI;
  open = false;
  name = '';

  constructor(mainBarUI: MainBarUI) {
    makeAutoObservable(this);
    this.mainBarUI = mainBarUI;
  }

  setOpen(open: boolean) {
    this.open = open;
  }

  setName(name: string) {
    this.name = name;
  }

  async createRoom() {
    const room = await RoomsAPI.create(this.name);
    runInAction(() => {
      this.mainBarUI.mainPanelUI.roomListUI.addRoom(room);
      this.open = false;
    });
  }
}
