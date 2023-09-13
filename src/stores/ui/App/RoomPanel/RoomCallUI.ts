import { makeAutoObservable } from 'mobx';
import { User } from '../../../../api/http/interfaces';
import RoomUI from './RoomUI';
import { authStore } from '../../../AuthStore';

export default class RoomCallUI {
  roomUI: RoomUI;

  get callInProgress() {
    return this.roomUI.appUI.mediasoupStore.callInProgress;
  }

  get userConsumers(): { track: MediaStreamTrack; user: User }[] {
    const users: { track: MediaStreamTrack; user: User }[] = [];
    for (const [, userConsumer] of this.mediasoupStore.userConsumers) {
      users.push({
        track: userConsumer.consumer.track,
        user: userConsumer.user,
      });
    }
    if (this.mediasoupStore.producer?.track)
      users.push({
        track: this.mediasoupStore.producer.track,
        user: authStore.user!,
      });
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
