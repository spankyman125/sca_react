import { makeAutoObservable } from 'mobx';
import MessagesAPI from '../../../../api/http/Messages';
import { Message } from '../../../../api/http/interfaces';
import { authStore } from '../../../AuthStore';
import RoomUI from './RoomUI';

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
    const messagePlaceholder: Message = {
      id: new Date().getTime(),
      content: this.messageContent,
      createdAt: new Date().toString(),
      roomId: this.roomId,
      userId: authStore.user?.id || -1,
      user: authStore.user,
    };
    void MessagesAPI.create(this.roomId, this.messageContent).then(
      (receivedMessage) => {
        const messageToEdit = this.roomUI.room.messages?.find(
          (message) => message.id === messagePlaceholder.id,
        );
        if (messageToEdit) Object.assign(messageToEdit, receivedMessage);
      },
    );
    this.roomUI.roomMessagesUI.addSelf(messagePlaceholder);
    this.messageContent = '';
  }
}
