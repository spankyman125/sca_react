import { makeAutoObservable } from 'mobx';
import { User } from '../../../../api/http/interfaces';
import RoomUI from './RoomUI';

export default class RoomCallUI {
  roomUI: RoomUI;

  get callInProgress() {
    return (
      this.roomUI.appUI.mediasoupStore.callInProgress &&
      this.roomUI.appUI.mediasoupStore.roomCallId === this.roomUI.roomId
    );
  }

  get userAudios(): {
    user: User;
    recorder: MediaRecorder;
    audio: HTMLAudioElement;
  }[] {
    return [...this.mediasoupStore.userConsumers].map(([_id, userConsumer]) => {
      return {
        audio: userConsumer.audio,
        user: userConsumer.user,
        recorder: userConsumer.recorder,
      };
    });
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
