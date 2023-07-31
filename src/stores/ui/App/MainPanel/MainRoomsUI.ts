import UsersAPI from '../../../../api/http/Users';
import { Message, Room } from '../../../../api/http/interfaces';
import SocketService from '../../../../api/socket/SocketService';
import { makeAutoObservable, runInAction } from 'mobx';
import MainPanelUI from './MainPanelUI';
import RoomCreateDialogUI from './RoomCreateDialogUI';

export default class MainRoomsUI {
  rooms: Array<Room> = [];
  mainPanelUI: MainPanelUI;

  roomCreateDialogUI: RoomCreateDialogUI;

  get activeRoomId() {
    return this.mainPanelUI.appUI.activeRoomId;
  }

  get socketService(): SocketService {
    return this.mainPanelUI.appUI.socketService;
  }

  constructor(mainPanelUI: MainPanelUI) {
    makeAutoObservable(this);
    this.mainPanelUI = mainPanelUI;
    this.roomCreateDialogUI = new RoomCreateDialogUI(this);
    this.socketService.io.on('messages:new', (message: Message) => {
      this.rooms.find((room) => room.id === message.roomId)!.messages![0] =
        message;
    });
    void this.fetch();
  }

  async fetch() {
    const rooms = await UsersAPI.getRoomsSelf();
    runInAction(() => {
      this.rooms = rooms;
    });
  }

  addRoom(room: Room) {
    this.rooms.push(room);
  }
}
