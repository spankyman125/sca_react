import { makeAutoObservable, runInAction } from 'mobx';
import React from 'react';
import { GroupedVirtuosoHandle } from 'react-virtuoso';
import RoomsAPI from '../../../../api/http/Rooms';
import { Message } from '../../../../api/http/interfaces';
import RoomUI from './RoomUI';
import MessagesAPI from '../../../../api/http/Messages';

export default class RoomMessagesUI {
  roomUI: RoomUI;
  firstItemIndex = 1000;
  take = 50;
  virtuosoRef: any = React.createRef<GroupedVirtuosoHandle>();
  isLoading = true;

  get messages() {
    return this.roomUI.room?.messages?.slice().reverse() || [];
  }

  get dateGroups(): { dateGroupCounts: number[]; dateGroupDates: Date[] } {
    if (this.messages.length === 0)
      return { dateGroupCounts: [1], dateGroupDates: [] };
    const dateGroupCounts: number[] = [];
    const dateGroupDates: Date[] = [];
    const currentGroupDate = new Date(this.messages[0].createdAt);
    let currentGroupCount = 0;
    this.messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      if (messageDate.getDate() === currentGroupDate.getDate()) {
        currentGroupCount++;
      } else {
        dateGroupCounts.push(currentGroupCount);
        dateGroupDates.push(new Date(currentGroupDate.getTime()));
        currentGroupCount = 1;
        currentGroupDate.setTime(messageDate.getTime());
      }
    });
    dateGroupCounts.push(currentGroupCount);
    dateGroupDates.push(new Date(currentGroupDate.getTime()));
    return { dateGroupCounts, dateGroupDates };
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

  addSelf(message: Message) {
    this.roomUI.addNewMessages(message);
    (
      this.virtuosoRef as React.MutableRefObject<GroupedVirtuosoHandle>
    ).current.scrollToIndex({
      index: this.messages.length,
      align: 'end',
      behavior: 'smooth',
    });
  }

  editMessage(messageId: number, content: string) {
    this.roomUI.editMessage(messageId, content);
    void MessagesAPI.update(messageId, content);
  }
}
