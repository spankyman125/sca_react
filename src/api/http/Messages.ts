import HttpBase from './HttpBase';
import { api } from './Utilities';
import { Message } from './interfaces';

export default class MessagesAPI extends HttpBase {
  static path: string = HttpBase.path + 'messages';

  static async create(roomId: number, content: string) {
    const params = new URLSearchParams({
      roomId: roomId.toString(),
    }).toString();
    return api<Message>(`${this.path}?${params}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  static async update(messageId: number, content: string) {
    return api<Message>(`${this.path}/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }
}
