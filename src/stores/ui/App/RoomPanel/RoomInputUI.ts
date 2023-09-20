import { makeAutoObservable } from 'mobx';
import MessagesAPI from '../../../../api/http/Messages';
import { Message } from '../../../../api/http/interfaces';
import { authStore } from '../../../AuthStore';
import RoomUI from './RoomUI';

export default class RoomInputUI {
  roomUI: RoomUI;
  text = '';
  attachments: File[] = [];

  get roomId() {
    return this.roomUI.roomId;
  }

  constructor(roomUI: RoomUI) {
    makeAutoObservable(this);
    this.roomUI = roomUI;
  }

  setMessage(message: string) {
    this.text = message;
  }

  setMessageAttachments(files: FileList | null) {
    if (files)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.attachments.push(file);
      }
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  get attachmentsUrls() {
    return this.attachments.map((attachment) => {
      return URL.createObjectURL(attachment);
    });
  }

  sendMessage() {
    const randomId = new Date().getTime();
    const messagePlaceholder: Message = {
      id: randomId,
      content: this.text,
      createdAt: new Date().toString(),
      roomId: this.roomId,
      userId: authStore.user?.id || -1,
      user: authStore.user,
      attachments: this.attachments.map((attachment, index) => {
        return {
          id: index,
          messageId: randomId,
          url: URL.createObjectURL(attachment),
        };
      }),
    };
    void MessagesAPI.create(this.roomId, this.text, this.attachments).then(
      (receivedMessage) => {
        const messageToEdit = this.roomUI.room.messages?.find(
          (message) => message.id === messagePlaceholder.id,
        );
        if (messageToEdit) Object.assign(messageToEdit, receivedMessage);
      },
    );
    this.roomUI.roomMessagesUI.addSelf(messagePlaceholder);
    this.text = '';
    this.attachments = [];
  }
}
