import { makeAutoObservable, runInAction } from 'mobx';
import RoomsAPI from '../../../../api/http/Rooms';
import { Room, User } from '../../../../api/http/interfaces';
import RoomUsersUI from './RoomBar/RoomUsersUI';
import RoomBarUI from './RoomBarUI';
import RoomInputUI from './RoomInputUI';
import RoomMessagesUI from './RoomMessagesUI';
import RoomPanelUI from './RoomPanelUI';
import RoomAddDialogUI from './RoomAddDialogUI';
import SocketService from '../../../../api/socket/SocketService';

export default class RoomUI {
  roomPanelUI: RoomPanelUI;

  roomBarUI: RoomBarUI;
  roomMessagesUI: RoomMessagesUI;
  roomUsersUI: RoomUsersUI;
  roomInputUI: RoomInputUI;
  roomAddDialogUI: RoomAddDialogUI;
  roomId: number;
  room: Room | undefined;

  get socketService(): SocketService {
    return this.roomPanelUI.appUI.socketService;
  }

  constructor(roomPanelUI: RoomPanelUI, roomId: number) {
    makeAutoObservable(this);
    this.roomId = roomId;
    this.roomPanelUI = roomPanelUI;
    this.roomMessagesUI = new RoomMessagesUI(this);
    this.roomInputUI = new RoomInputUI(this);
    this.roomBarUI = new RoomBarUI(this);
    this.roomUsersUI = new RoomUsersUI(this);
    this.roomAddDialogUI = new RoomAddDialogUI(this);
    this.socketService.io.on('rooms:joined', (user: User) => {
      this.room?.users?.push(user);
    });
    void this.fetch();
  }

  async fetch() {
    const room = await RoomsAPI.findOne(this.roomId);
    const users = await RoomsAPI.getUsers(this.roomId);
    runInAction(() => {
      this.room = { ...room, users: users };
    });
  }

  async removeUser(userId: number) {
    if (this.room) {
      await RoomsAPI.removeUser(this.roomId, userId);
      // this.room.users?.pop();
      runInAction(() => {
        this.room!.users = this.room?.users?.filter(
          (user) => user.id !== userId,
        );
      });
    }
  }

  async addUser(userId: number) {
    if (this.room) {
      const addedUser = await RoomsAPI.addUser(this.roomId, userId);
      runInAction(() => {
        this.room!.users?.push(addedUser);
      });
    }
  }
}
