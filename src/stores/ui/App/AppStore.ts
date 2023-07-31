import { makeAutoObservable } from 'mobx';
import MainPanelUI from './MainPanel/MainPanelUI';
import RoomPanelUI from './RoomPanel/RoomPanelUI';
import SocketService from '../../../api/socket/SocketService';
import { authStore } from '../../AuthStore';

export default class AppStore {
  socketService: SocketService;
  activeRoomId: number | undefined = undefined;
  mainPanelUI: MainPanelUI;
  roomPanelUI: RoomPanelUI;

  constructor() {
    makeAutoObservable(this);
    this.socketService = new SocketService(authStore.access_token);
    this.mainPanelUI = new MainPanelUI(this);
    this.roomPanelUI = new RoomPanelUI(this);
  }

  setActive(roomId: number | undefined) {
    if (this.activeRoomId !== roomId) this.activeRoomId = roomId;
  }
}
