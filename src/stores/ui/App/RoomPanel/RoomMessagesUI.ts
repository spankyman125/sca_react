import RoomsAPI from '../../../../api/http/Rooms';
import { Message } from '../../../../api/http/interfaces';
import { makeAutoObservable, runInAction } from 'mobx';
import RoomUI from './RoomUI';

export default class RoomMessagesUI {
  roomUI: RoomUI;
  firstItemIndex = Number.MAX_SAFE_INTEGER;
  messages: Message[] = [];
  take = 50;
  virtuosoRef: any;

  get socketService() {
    return this.roomUI.roomPanelUI.appUI.socketService;
  }

  get roomId() {
    return this.roomUI.roomId;
  }

  get visible() {
    return this.roomId === this.roomUI.roomPanelUI.appUI.activeRoomId;
  }

  get initialTopMostItemIndex() {
    return this.messages.length - 1;
  }

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
    this.socketService.io.on('messages:new', (message: Message) => {
      if (message.roomId === this.roomId) this.add(message);
    });
    void this.fetchMore();
  }

  async fetchMore() {
    const messages = await RoomsAPI.getMessages(
      this.roomId,
      this.messages.length,
      this.take,
    );
    runInAction(() => {
      this.messages = messages.reverse().concat(this.messages);
      this.firstItemIndex = this.firstItemIndex - messages.length;
    });
  }

  setRef(ref: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (this.virtuosoRef !== ref) this.virtuosoRef = ref;
  }

  add(message: Message) {
    this.messages.push(message);
  }

  addSelf(message: Message) {
    this.messages.push(message);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this.virtuosoRef.current.scrollToIndex({
      index: this.messages.length,
      align: 'end',
      behaviour: 'smooth',
    });
    this.roomUI.roomPanelUI.appUI.mainPanelUI.roomListUI.rooms.find(
      (room) => room.id === this.roomId,
    )!.messages![0] = message;
  }
}
