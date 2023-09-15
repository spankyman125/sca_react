import { makeAutoObservable } from 'mobx';
import MainPanelUI from './MainPanelUI';
import { Room } from '../../../../api/http/interfaces';

export default class MainRoomsUI {
  mainPanelUI: MainPanelUI;

  get rooms(): Room[] {
    const rooms: Room[] = [];
    this.mainPanelUI.appUI.rooms.forEach((room) => {
      if (
        room.name
          .toLowerCase()
          .includes(this.mainPanelUI.mainBarUI.searchedText.toLowerCase())
      )
        rooms.push(room);
    });
    return rooms;
  }

  get activeRoomId() {
    return this.mainPanelUI.appUI.activeRoomId;
  }

  constructor(mainPanelUI: MainPanelUI) {
    makeAutoObservable(this);
    this.mainPanelUI = mainPanelUI;
  }
}
