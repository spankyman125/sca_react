import { makeAutoObservable, runInAction } from 'mobx';
import UsersAPI from '../../../api/http/Users';
import { Message, Room, User } from '../../../api/http/interfaces';
import SocketService from '../../../api/socket/SocketService';
import { authStore } from '../../AuthStore';
import MainPanelUI from './MainPanel/MainPanelUI';
import SecondaryPanelUI from './RoomPanel/RoomPanelUI';
import MediasoupStore from '../../MediasoupStore';

export default class AppStore {
  socketService: SocketService;
  mediasoupStore: MediasoupStore;
  activeRoomId: number | undefined = undefined;
  roomIdToSet: number | undefined = undefined;
  mainPanelUI: MainPanelUI;
  secondaryPanelUI: SecondaryPanelUI;
  rooms = new Map<number, Room>();

  constructor() {
    makeAutoObservable(this);
    this.socketService = new SocketService(authStore.access_token);
    this.mediasoupStore = new MediasoupStore(this);
    this.mainPanelUI = new MainPanelUI(this);
    this.secondaryPanelUI = new SecondaryPanelUI(this);
    void this.fetch();
    this.socketService.io.on('rooms:left', (room: Room) => {
      this.removeRoom(room.id);
    });
    this.socketService.io.on(
      'rooms:joined',
      (userJoinedEvent: User & { roomId: number }) => {
        this.getRoom(userJoinedEvent.id)?.users?.push(userJoinedEvent);
      },
    );
    this.socketService.io.on('rooms:invite-accepted', (roomJoined: Room) => {
      this.addRoom({ ...roomJoined, users: [] });
    });
    this.socketService.io.on('messages:new', (message: Message) => {
      this.getRoom(message.roomId)?.messages?.unshift(message);
    });
    this.socketService.io.on('messages:edited', (message: Message) => {
      const room = this.getRoom(message.roomId);
      if (room) {
        const messageToEdit = room.messages?.find(
          (roomMessage) => roomMessage.id === message.id,
        );
        if (messageToEdit) messageToEdit.content = message.content;
      }
    });
  }

  setActive(roomId: number | undefined) {
    if (this.activeRoomId !== roomId) {
      if (roomId === undefined) {
        this.activeRoomId = undefined;
      } else {
        if (this.rooms.has(roomId || -1)) {
          this.activeRoomId = roomId;
          this.secondaryPanelUI.ensureRoomUI(roomId);
        } else {
          this.roomIdToSet = roomId;
        }
      }
    }
  }

  async fetch() {
    const rooms = await UsersAPI.getRoomsSelf();
    runInAction(() => {
      this.rooms = new Map(rooms.map((room) => [room.id, room]));
    });
    this.setActive(this.roomIdToSet);
  }

  addRoom(room: Room) {
    this.rooms.set(room.id, room);
  }

  getRoom(roomId: number) {
    return this.rooms.get(roomId);
  }

  removeRoom(roomId: number) {
    return this.rooms.delete(roomId);
  }
}
