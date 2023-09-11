import { makeAutoObservable } from 'mobx';
import { User } from '../../../../api/http/interfaces';
import RoomUI from './RoomUI';

export default class RoomCallUI {
  roomUI: RoomUI;

  get isCalling() {
    return this.roomUI.appUI.mediasoupStore.roomCallId === this.roomUI.roomId;
  }

  get userConsumers(): { track: MediaStreamTrack; user: User }[] {
    const users: { track: MediaStreamTrack; user: User }[] = [];
    for (const [, userConsumer] of this.mediasoupStore.userConsumers) {
      users.push({
        track: userConsumer.consumer.track,
        user: userConsumer.user,
      });
    }
    return users;
  }

  get mediasoupStore() {
    return this.roomUI.appUI.mediasoupStore;
  }

  get socketService() {
    return this.roomUI.appUI.socketService;
  }

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
  }
}
