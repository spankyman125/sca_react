import { makeAutoObservable, runInAction } from 'mobx';
import RoomsAPI from '../../../../api/http/Rooms';
import { Message } from '../../../../api/http/interfaces';
import RoomUI from './RoomUI';

export default class RoomMessagesUI {
  roomUI: RoomUI;
  firstItemIndex = Number.MAX_SAFE_INTEGER / 2;
  take = 50;
  virtuosoRef: any;
  isLoading = true;

  get messages() {
    return this.roomUI.room?.messages?.slice().reverse() || [];
  }

  get initialTopMostItemIndex() {
    return this.messages.length - 1;
  }

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
    void this.fetchMore();
  }

  async fetchMore() {
    const messages = await RoomsAPI.getMessages(
      this.roomUI.roomId,
      this.messages.length,
      this.take,
    );
    runInAction(() => {
      this.roomUI.addOldMessages(...messages);
      this.firstItemIndex = this.firstItemIndex - messages.length;
      this.isLoading = false;
    });
  }

  setRef(ref: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (this.virtuosoRef !== ref) this.virtuosoRef = ref;
  }

  addSelf(message: Message) {
    this.roomUI.addNewMessages(message);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this.virtuosoRef.current.scrollToIndex({
      index: this.messages.length,
      align: 'end',
      behaviour: 'smooth',
    });
  }
}
