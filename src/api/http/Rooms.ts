import HttpBase from './HttpBase';
import { api } from './Utilities';
import { Message, Room, User } from './interfaces';

export default class RoomsAPI extends HttpBase {
  static path: string = HttpBase.path + 'rooms';

  static async findAll() {
    return api<Room[]>(this.path, { method: 'GET' });
  }

  static async create(name: string, image?: File) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', image ? image : '');
    return api<Room>(this.path, {
      method: 'POST',
      headers: { 'Content-Type': '' },
      body: formData,
    });
  }

  static async findOne(roomId: number) {
    return api<Room>(`${this.path}/${roomId}`, { method: 'GET' });
  }

  static async search(name: string, signal?: AbortSignal) {
    const params = new URLSearchParams({
      name: name,
    }).toString();
    return api<Room[]>(
      `${this.path}/search?${params}`,
      { method: 'GET' },
      signal,
    );
  }

  protected static async update(roomId: number, content: string) {
    return api<Room>(`${this.path}/${roomId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  static async delete(roomId: number) {
    return api<Room>(`${this.path}/${roomId}`, { method: 'DELETE' });
  }

  static async getMessages(roomId: number, skip = 0, take = 50) {
    const params = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString(),
    }).toString();
    return api<Message[]>(`${this.path}/${roomId}/messages?${params}`, {
      method: 'GET',
    });
  }

  static async getUsers(roomId: number) {
    return api<User[]>(`${this.path}/${roomId}/users`, { method: 'GET' });
  }

  static async addUser(roomId: number, userId: number) {
    return api<User>(`${this.path}/${roomId}/users`, {
      method: 'POST',
      body: JSON.stringify({ id: userId }),
    });
  }

  static async removeUser(roomId: number, userId: number) {
    return api<User>(`${this.path}/${roomId}/users/${userId}`, {
      method: 'DELETE',
    });
  }
}
