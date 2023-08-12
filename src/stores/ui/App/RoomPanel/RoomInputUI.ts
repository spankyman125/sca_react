import MessagesAPI from '../../../../api/http/Messages';
import { Message } from '../../../../api/http/interfaces';
import { makeAutoObservable } from 'mobx';
import { authStore } from '../../../AuthStore';
import RoomUI from './RoomUI';
import { error } from 'console';

export default class RoomInputUI {
  roomUI: RoomUI;
  messageContent = '';

  get roomId() {
    return this.roomUI.roomId;
  }

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
  }

  setMessage(message: string) {
    this.messageContent = message;
  }

  sendMessage() {
    let newMessage: Message = {
      id: new Date().getTime(),
      content: this.messageContent,
      createdAt: new Date().toString(),
      roomId: this.roomId,
      userId: authStore.user?.id || -1,
      user: authStore.user,
    };
    void MessagesAPI.create(this.roomId, this.messageContent).then(
      (message) => {
        newMessage = message;
      },
    );
    this.roomUI.roomMessagesUI.addSelf(newMessage);
    this.messageContent = '';
  }
}
