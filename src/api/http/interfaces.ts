export interface User {
  id: number;
  username: string;
  passwordHash: string;
  pseudonym: string;
  isOnline: string;
  avatarUrl: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  roomId: number;
  userId: number;
  user?: User;
}

export interface Room {
  id: number;
  name: string;
  avatarUrl: string;
  private: boolean;
  messages?: Message[];
  users?: User[];
}

export interface Credentials {
  access_token: string;
  refresh_token: string;
}
