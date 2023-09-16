import HttpBase from './HttpBase';
import { api } from './Utilities';
import { Message, Room, User } from './interfaces';

export default class UsersAPI extends HttpBase {
  static path: string = HttpBase.path + 'users';

  static async getUsers() {
    return api<User[]>(this.path, { method: 'GET' });
  }

  static async createUser(
    username: string,
    password: string,
    pseudonym: string,
  ) {
    return api<User[]>(this.path, {
      method: 'POST',
      body: JSON.stringify({ username, password, pseudonym }),
    });
  }

  static async me() {
    return api<User>(`${this.path}/me`, { method: 'GET' });
  }

  protected static async updateMe(pseudonym: string) {
    return api(`${this.path}/me`, {
      method: 'PATCH',
      body: JSON.stringify({ pseudonym }),
    });
  }

  static async deleteMe() {
    return api(`${this.path}/me`, { method: 'DELETE' });
  }

  static async getRoomsSelf() {
    return api<Room[]>(`${this.path}/me/rooms`, { method: 'GET' });
  }

  static async joinRoom(roomId: number) {
    const params = new URLSearchParams({
      roomId: roomId.toString(),
    }).toString();
    return api<Room>(`${this.path}/me/rooms?${params}`, { method: 'POST' });
  }

  static async leaveRoom(roomId: number) {
    return api<Room>(`${this.path}/me/rooms/${roomId}`, { method: 'DELETE' });
  }

  static async getMessagesSelf() {
    return api<Message[]>(`${this.path}/me/messages`, { method: 'GET' });
  }

  static async getFriendsSelf() {
    return api<User[]>(`${this.path}/me/friends`, { method: 'GET' });
  }

  static async addFriend(friendId: number) {
    const params = new URLSearchParams({
      friendId: friendId.toString(),
    }).toString();
    return api<User>(`${this.path}/me/friends?${params}`, { method: 'POST' });
  }

  static async removeFriend(friendId: number) {
    return api<User>(`${this.path}/me/friends/${friendId}`, {
      method: 'DELETE',
    });
  }

  static async getUser(userId: number) {
    return api<User>(`${this.path}/${userId}`);
  }

  static async search(
    username: string,
    pseudonym: string,
    signal?: AbortSignal,
  ) {
    const params = new URLSearchParams({
      username: username,
      pseudonym: pseudonym,
    }).toString();
    return api<User[]>(
      `${this.path}/search?${params}`,
      { method: 'GET' },
      signal,
    );
  }

  static async getRooms(userId: number) {
    return api<Room[]>(`${this.path}/${userId}`);
  }

  static async getFriends(userId: number) {
    return api<User[]>(`${this.path}/${userId}/friends`);
  }
}
